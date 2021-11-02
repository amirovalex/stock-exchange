const urlParams = new URLSearchParams(window.location.search);
const selectedCompany = urlParams.toString();
const companySymbol = selectedCompany.slice(
  selectedCompany.indexOf("=") + 1,
  selectedCompany.length
);
const companyLogo = document.getElementsByClassName("companyLogo")[0];
const companyName = document.getElementsByClassName("companyName")[0];
const companyDescription =
  document.getElementsByClassName("companyDescription")[0];
const companyLink = document.getElementsByClassName("companyLink")[0];
const companyInfoWithChart = document.getElementsByClassName(
  "companyInfoWithChart"
)[0];
const spinnerCompany = document.getElementById("loadingCompany");

const updateCompanyInfo = (logo, name, description, link) => {
  try {
    companyLogo.src = logo;
    companyName.innerText = name;
    companyDescription.innerText = description;
    companyLink.href = link;
  } catch (err) {
    console.log(err);
    // companyLogo.src =
    //   "https://media.istockphoto.com/photos/abstract-financial-graph-with-up-trend-line-candlestick-chart-in-on-picture-id1262836699?k=20&m=1262836699&s=612x612&w=0&h=tx7vjNHhBjIRX76Xa80cm8jk9eXiXZoEJP2hgotTNXE=";
  }
};

const updateCompanyChart = (companyHistory) => {
  let minPrice = 0;
  let maxPrice = 0;
  let startingYear;
  const sortPerDays = 5;
  let tempArr = [];
  const historyLength = companyHistory.historical.length;
  const companyHistoryDates = companyHistory.historical;
  for (let i = 0; i < historyLength; i += sortPerDays) {
    tempArr.push(companyHistoryDates[i]);
    if (i + sortPerDays >= historyLength) {
      tempArr.push(companyHistoryDates[companyHistoryDates.length - 1]);
    }
  }
  const labels = [];
  const closedPrices = [];
  for (let i = tempArr.length - 1; i >= 0; i--) {
    labels.push(
      new Date(tempArr[i].date).toLocaleString("default", { month: "long" })
    );
    closedPrices.push(tempArr[i].close);
  }
  tempArr.map(() => {
    labels.push();
  });
  console.log(labels);
  console.log(closedPrices);
  const data = {
    labels: labels,
    datasets: [
      {
        label: `${companySymbol} Stock Prices`,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: closedPrices,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };
  const myChart = new Chart(document.getElementById("myChart"), config);
};

const fetchCompanyHistory = async (symbol) => {
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
    );
    const data = await response.json();
    updateCompanyChart(data);
  } catch (err) {
    console.log(err);
  }
};

const fetchCompanyInfo = async (symbol) => {
  try {
    companyInfoWithChart.classList.add("d-none");
    spinnerCompany.classList.remove("d-none");
    const response = await fetch(
      `https://stock-
exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
    );
    const data = await response.json();
    updateCompanyInfo(
      data.profile.image,
      data.profile.companyName,
      data.profile.description,
      data.profile.website
    );
    fetchCompanyHistory(symbol);
  } catch (err) {
    console.log(err);
  } finally {
    companyInfoWithChart.classList.remove("d-none");
    spinnerCompany.classList.add("d-none");
  }
};

const init = async () => {
  return fetchCompanyInfo(companySymbol);
};

init();
