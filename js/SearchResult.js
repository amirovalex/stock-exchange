class SearchResult {
  constructor(resultsListDom) {
    this.resultsList = resultsListDom;
    this.marquee = document.getElementsByClassName("marquee")[0];
    this.html = document.getElementsByTagName("html")[0];
    this.body = document.getElementsByTagName("body")[0];
  }

  createSpinner() {
    this.spinner = document.createElement("div");
    this.spinner.id = "loading";
    this.spinner.classList.add("d-none");
    this.resultsList.appendChild(this.spinner);
  }

  clearResults(childrenNum) {
    for (let i = 0; i < childrenNum - 1; i++) {
      this.resultsList.removeChild(resultsList.lastChild);
    }
  }

  highlight(text, indexOfTile) {
    const inputLinkDom =
      document.getElementsByClassName("stock-tile-name")[indexOfTile];
    const inputLinkHTML = inputLinkDom.innerHTML;
    const replacedHTML = inputLinkHTML.replace(
      new RegExp(text, "gi"),
      (match) => {
        return `<span class='highlight'>${match}</span>`;
      }
    );
    inputLinkDom.innerHTML = replacedHTML;
  }

  toggleSizeOnFetch(onIndex = false) {
    if (onIndex) {
      this.resultsList.classList.toggle("height-100");
      this.marquee.classList.toggle("padding-bottom-1");
    }
    this.html.classList.toggle("height-100");
    this.body.classList.toggle("height-100");
  }

  classChangesOnSearch(useStart) {
    if (useStart === "start") {
      if (this.resultsList.children.length > 1) {
        this.clearResults(resultsList.children.length);
      }
      this.toggleSizeOnFetch(true);
      this.resultsList.classList.remove("p-top-0");
      this.spinner.classList.remove("d-none");
      this.resultsList.classList.add("align-center");
      this.resultsList.classList.add("flex-grow");
    } else {
      this.toggleSizeOnFetch(true);
      document.getElementById("loading").classList.add("d-none");
      this.resultsList.classList.remove("align-center");
      this.resultsList.classList.add("p-top-0");
      this.resultsList.classList.remove("flex-grow");
    }
  }
  createLogoForSearchItem(logo) {
    const companyLogo = document.createElement("img");
    companyLogo.src = logo;
    companyLogo.height = "50";
    companyLogo.width = "50";
    companyLogo.classList.add("mr-1");
    return companyLogo;
  }

  checkIfImageExists(stock) {
    if (Object.keys(stock.data).length !== 0) {
      return this.createLogoForSearchItem(stock.data.profile.image);
    } else {
      return this.createLogoForSearchItem(
        "https://media.istockphoto.com/photos/abstract-financial-graph-with-up-trend-line-candlestick-chart-in-on-picture-id1262836699?k=20&m=1262836699&s=612x612&w=0&h=tx7vjNHhBjIRX76Xa80cm8jk9eXiXZoEJP2hgotTNXE="
      );
    }
  }

  createListData(response) {
    try {
      response.map(async (stock, indexOfTile) => {
        const listItem = document.createElement("a");
        listItem.href = `./company.html?symbol=${stock.symbol}`;
        listItem.classList.add("result-tile");
        let logoImage = this.checkIfImageExists(stock);
        listItem.appendChild(logoImage);
        const stockName = document.createElement("span");
        stockName.innerText = `${stock.name} (${stock.symbol})`;
        stockName.className = "stock-tile-name";
        listItem.appendChild(stockName);
        if (Object.keys(stock.data).length !== 0) {
          const growthData = this.createGrowthToSearchItem(
            stock.data.profile.changesPercentage
          );
          listItem.appendChild(growthData);
        }
        this.resultsList.appendChild(listItem);
        this.highlight(document.getElementById("input").value, indexOfTile);
      });
    } catch (err) {
      console.log("ERRR", err);
    } finally {
      this.classChangesOnSearch("finish");
    }
  }

  createGrowthToSearchItem(changesPercentage) {
    const companyPriceRise = document.createElement("span");
    companyPriceRise.innerText = `${
      changesPercentage.charAt(0) === "-"
        ? `(${changesPercentage.slice(0, 4)}%)`
        : `(+${changesPercentage.slice(0, 4)}%)`
    }`;
    if (changesPercentage.charAt(0) === "-") {
      companyPriceRise.classList.add("red");
    } else {
      companyPriceRise.classList.add("green");
    }
    companyPriceRise.classList.add("mrl-1");
    return companyPriceRise;
  }

  onInit() {
    this.createSpinner();
  }
}
