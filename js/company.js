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
const companyPrice = document.getElementsByClassName("companyPrice")[0];
const companyInfoWithChart = document.getElementsByClassName(
  "companyInfoWithChart"
)[0];
const spinnerCompany = document.getElementById("loadingCompany");

const updateCompanyInfo = (
  logo,
  name,
  description,
  link,
  changesPercentage,
  currentClose
) => {
  try {
    companyLogo.src = logo;
    companyName.innerText = name;
    companyDescription.innerText = description;
    companyLink.href = link;
    updateCompanyPrice(changesPercentage, currentClose.close);
  } catch (err) {
    console.log(err);
  }
};

const updateCompanyPrice = (changesPercentage, stockPrice) => {
  const stockGrowthSpan = document.createElement("span");
  const stockPriceSpan = document.createElement("span");
  stockPriceSpan.innerText = stockPrice;
  companyPrice.appendChild(stockPriceSpan);
  stockGrowthSpan.innerText = `${
    changesPercentage.charAt(0) === "-"
      ? `(${changesPercentage.slice(0, 4)}%)`
      : `(+${changesPercentage.slice(0, 4)}%)`
  }`;
  companyPrice.appendChild(stockGrowthSpan);
  if (changesPercentage.charAt(0) === "-") {
    stockGrowthSpan.classList.remove("green");
    stockGrowthSpan.classList.add("red");
  } else {
    stockGrowthSpan.classList.remove("red");
    stockGrowthSpan.classList.add("green");
  }
};

const updateCompanyChart = (companyHistory) => {
  const sortPerDays = 5;
  let tempArr = [];
  const labels = [];
  const closedPrices = [];
  const historyLength = companyHistory.historical.length;
  const companyHistoryDates = companyHistory.historical;
  for (let i = 0; i < historyLength; i += sortPerDays) {
    tempArr.push(companyHistoryDates[i]);
    if (i + sortPerDays >= historyLength) {
      tempArr.push(companyHistoryDates[companyHistoryDates.length - 1]);
    }
  }
  for (let i = tempArr.length - 1; i >= 0; i--) {
    labels.push(
      new Date(tempArr[i].date).toLocaleString("default", { month: "long" })
    );
    closedPrices.push(tempArr[i].close);
  }
  tempArr.map(() => {
    labels.push();
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: `${companySymbol}`,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: closedPrices,
      },
    ],
  };
  tempArr.reverse();
  const config = {
    type: "line",
    data: data,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.raw}$ ${tempArr[context.dataIndex].date}`;
            },
          },
        },
      },
    },
  };
  const myChart = new Chart(document.getElementById("myChart"), config);
};

const init = () => {
  if (companyInfoWithChart) {
    return searchForm.fetchCompanyInfo(companySymbol);
  }
};

init();
