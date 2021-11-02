const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.toString());

import { button, input, resultsList, spinner } from "./constants.js";

import {
  fetchCompanyInfo,
  fetchCompanyHistory,
  checkGrowthPercentage,
} from "./company.js";

const clearResults = (childrenNum) => {
  for (let i = 0; i < childrenNum - 1; i++) {
    resultsList.removeChild(resultsList.lastChild);
  }
};

const classChangesOnSearchStart = () => {
  if (resultsList.children.length > 1) {
    clearResults(resultsList.children.length);
  }
  resultsList.classList.remove("p-top-0");
  spinner.classList.remove("d-none");
  resultsList.classList.add("align-center");
};

const classChangesOnSearchFinish = () => {
  spinner.classList.add("d-none");
  resultsList.classList.remove("align-center");
  resultsList.classList.add("p-top-0");
};

const addLogoToSearchItem = (logo, stock) => {
  console.log("logo", stock);
  const companyLogo = document.createElement("img");
  companyLogo.src = logo;
  companyLogo.height = "50";
  companyLogo.width = "50";
  companyLogo.classList.add("mr-1");
  return companyLogo;
};

const addGrowthToSearchItem = (info) => {
  const companyPriceRise = document.createElement("span");
  console.log("growth", info);
  const previousClose = info.historical[1].close;
  const stockPrice = info.historical[0].close;
  const stockGrowth = checkGrowthPercentage(previousClose, stockPrice);
  companyPriceRise.innerText = `${
    previousClose > stockPrice
      ? `(-${stockGrowth.slice(0, 4)}%)`
      : `(${stockGrowth.slice(0, 4)}%)`
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
    classChangesOnSearchStart();
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
    );
    const data = await response.json();
    console.log(data);
    data.map(async (stock) => {
      console.log("stock symbol", stock.symbol);
      const fetchedInfoData = await fetchCompanyInfo(stock.symbol, false);
      console.log("fetched  data", fetchedInfoData);
      let logoImage;
      const fetchedHistoryData = await fetchCompanyHistory(stock.symbol, false);
      if (Object.keys(fetchedInfoData).length !== 0) {
        logoImage = addLogoToSearchItem(fetchedInfoData.profile.image, stock);
      } else {
        logoImage = addLogoToSearchItem(
          "https://media.istockphoto.com/photos/abstract-financial-graph-with-up-trend-line-candlestick-chart-in-on-picture-id1262836699?k=20&m=1262836699&s=612x612&w=0&h=tx7vjNHhBjIRX76Xa80cm8jk9eXiXZoEJP2hgotTNXE=",
          stock
        );
      }
      const growthData = addGrowthToSearchItem(fetchedHistoryData);

      const listItem = document.createElement("a");
      listItem.href = `./company.html?symbol=${stock.symbol}`;
      listItem.classList.add("result-tile");
      listItem.appendChild(logoImage);
      listItem.appendChild(
        document.createTextNode(`${stock.name} (${stock.symbol})`)
      );
      listItem.appendChild(growthData);
      resultsList.appendChild(listItem);
    });
  } catch (err) {
    console.log(err);
  } finally {
    classChangesOnSearchFinish();
  }
};

button.addEventListener("click", async (e) => {
  const response = await onSearchCallAsync(input.value);
  return response;
});

input.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    const response = await onSearchCallAsync(input.value);
    return response;
  }
});
