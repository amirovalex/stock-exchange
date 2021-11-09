class SearchForm {
  constructor(formDom) {
    this.formDiv = formDom;
  }

  createForm() {
    this.searchButton = document.createElement("button");
    this.searchButton.id = "searchButton";
    const searchButtonInner = document.createElement("strong");
    searchButtonInner.innerText = "Search";
    this.searchButton.appendChild(searchButtonInner);
    this.formInput = document.createElement("input");
    this.formInput.id = "input";
    this.formInput.type = "text";
    this.formDiv.appendChild(this.formInput);
    this.formDiv.appendChild(this.searchButton);
  }

  addButtonClickEvent(createListDataCallback) {
    this.searchButton.addEventListener("click", async (e) => {
      const response = await this.onSearchCallAsync(this.formInput.value);
      const listData = createListDataCallback(response);
      return listData;
    });
  }
  addButtonEnterEvent(createListDataCallback) {
    this.formInput.addEventListener("keydown", async (e) => {
      if (e.keyCode === 13) {
        const response = await this.onSearchCallAsync(this.formInput.value);
        const listData = createListDataCallback(response);
        return listData;
      }
    });
  }

  async getCompanyInfo(symbol) {
    const response = await fetch(
      `https://stock-
exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
    );
    const data = await response.json();
    return data;
  }

  async fetchCompanyHistory(symbol, onCompany = true) {
    try {
      const response = await fetch(
        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
      );
      const data = await response.json();
      if (onCompany) {
        updateCompanyChart(data);
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async fetchCompanyInfo(symbol, onCompany = true) {
    try {
      if (onCompany) {
        companyInfoWithChart.classList.add("d-none");
        spinnerCompany.classList.remove("d-none");
        this.toggleSizeOnFetch();
      }
      const companyInfo = await this.getCompanyInfo(symbol);
      const responseHistory = await this.fetchCompanyHistory(symbol, onCompany);
      if (onCompany) {
        updateCompanyInfo(
          companyInfo.profile.image,
          companyInfo.profile.companyName,
          companyInfo.profile.description,
          companyInfo.profile.website,
          companyInfo.profile.changesPercentage,
          responseHistory.historical[0]
        );
      }
      return companyInfo;
    } catch (err) {
      console.log(err);
    } finally {
      if (onCompany) {
        this.toggleSizeOnFetch();
        companyInfoWithChart.classList.remove("d-none");
        spinnerCompany.classList.add("d-none");
      }
    }
  }

  async onSearchCallAsync(query) {
    try {
      this.classChangesOnSearch("start");
      const response = await fetch(
        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
      );
      const data = await response.json();
      let allFetch = data.map(async (stock) => {
        const fetchedInfoData = await this.fetchCompanyInfo(
          stock.symbol,
          false
        );
        const fetchedHistoryData = await this.fetchCompanyHistory(
          stock.symbol,
          false
        );
        return {
          name: stock.name,
          data: fetchedInfoData,
          history: fetchedHistoryData,
          symbol: stock.symbol,
        };
      });
      return Promise.all(allFetch);
    } catch (err) {
      console.log(err);
    }
  }

  onInit(
    createListDataCallback,
    toggleSizeOnFetchCallback,
    classChangesOnSearchCallback,
    onCompany = false
  ) {
    if (!onCompany) {
      this.createForm();
      this.addButtonClickEvent(createListDataCallback);
      this.addButtonEnterEvent(createListDataCallback);
    }
    this.toggleSizeOnFetch = toggleSizeOnFetchCallback;
    this.classChangesOnSearch = classChangesOnSearchCallback;
  }
}
