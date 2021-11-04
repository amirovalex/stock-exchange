// const urlParams = new URLSearchParams(window.location.search);
const button = document.getElementById("searchButton");
const input = document.getElementsByTagName("input")[0];
const resultsList = document.getElementsByClassName("results-list")[0];
const spinner = document.getElementById("loading");

const clearResults = (childrenNum) => {
  for (let i = 0; i < childrenNum - 1; i++) {
    resultsList.removeChild(resultsList.lastChild);
  }
};

const classChangesOnSearch = (useStart) => {
  if (useStart === "start") {
    if (resultsList.children.length > 1) {
      clearResults(resultsList.children.length);
    }
    resultsList.classList.remove("p-top-0");
    spinner.classList.remove("d-none");
    resultsList.classList.add("align-center");
    resultsList.classList.add("flex-grow");
  } else {
    spinner.classList.add("d-none");
    resultsList.classList.remove("align-center");
    resultsList.classList.add("p-top-0");
    resultsList.classList.remove("flex-grow");
  }
};

const createLogoForSearchItem = (logo) => {
  const companyLogo = document.createElement("img");
  companyLogo.src = logo;
  companyLogo.height = "50";
  companyLogo.width = "50";
  companyLogo.classList.add("mr-1");
  return companyLogo;
};

const addGrowthToSearchItem = (info) => {
  const companyPriceRise = document.createElement("span");
  const previousClose = info.historical[1].close;
  const stockPrice = info.historical[0].close;
  const stockGrowth = checkGrowthPercentage(previousClose, stockPrice);
  companyPriceRise.innerText = `${
    previousClose > stockPrice
      ? `(${stockGrowth.slice(0, 4)}%)`
      : `(+${stockGrowth.slice(0, 4)}%)`
  }`;
  if (previousClose > stockPrice) {
    companyPriceRise.classList.add("red");
  } else {
    companyPriceRise.classList.add("green");
  }
  companyPriceRise.classList.add("mrl-1");
  return companyPriceRise;
};

const onSearchCallAsync = async (query) => {
  try {
    classChangesOnSearch("start");
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
    );
    const data = await response.json();
    let allFetch = data.map(async (stock) => {
      const fetchedInfoData = await fetchCompanyInfo(stock.symbol, false);
      const fetchedHistoryData = await fetchCompanyHistory(stock.symbol, false);
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
};

const checkIfImageExists = (stock) => {
  if (Object.keys(stock.data).length !== 0) {
    return createLogoForSearchItem(stock.data.profile.image);
  } else {
    return createLogoForSearchItem(
      "https://media.istockphoto.com/photos/abstract-financial-graph-with-up-trend-line-candlestick-chart-in-on-picture-id1262836699?k=20&m=1262836699&s=612x612&w=0&h=tx7vjNHhBjIRX76Xa80cm8jk9eXiXZoEJP2hgotTNXE="
    );
  }
};

const manipulateData = (response) => {
  try {
    response.map(async (stock) => {
      const growthData = addGrowthToSearchItem(stock.history);
      const listItem = document.createElement("a");
      listItem.href = `./company.html?symbol=${stock.symbol}`;
      listItem.classList.add("result-tile");
      let logoImage = checkIfImageExists(stock);
      listItem.appendChild(logoImage);
      listItem.appendChild(
        document.createTextNode(`${stock.name} (${stock.symbol})`)
      );
      listItem.appendChild(growthData);
      resultsList.appendChild(listItem);
    });
  } catch (err) {
    console.log("ERRR", err);
  } finally {
    classChangesOnSearch("finish");
  }
};

button.addEventListener("click", async (e) => {
  const response = await onSearchCallAsync(input.value);
  const manipulatedData = await manipulateData(response);
  return manipulateData;
});

input.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    const response = await onSearchCallAsync(input.value);
    const manipulatedData = await manipulateData(response);
    return manipulateData;
  }
});
