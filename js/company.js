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
  previousClose,
  currentClose
) => {
  try {
    companyLogo.src = logo;
    companyName.innerText = name;
    companyDescription.innerText = description;
    companyLink.href = link;
    updateCompanyPrice(previousClose.close, currentClose.close);
  } catch (err) {
    console.log(err);
  }
};

const checkGrowthPercentage = (previousClose, stockPrice) => {
  const stockGrowth = (
    ((stockPrice - previousClose) / previousClose) *
    100
  ).toString();
  return stockGrowth;
};

const updateCompanyPrice = (previousClose, stockPrice) => {
  const stockGrowth = checkGrowthPercentage(previousClose, stockPrice);
  const stockGrowthSpan = document.createElement("span");
  companyPrice.innerText = stockPrice;
  stockGrowthSpan.innerText = `${
    previousClose > stockPrice
      ? `(${stockGrowth.slice(0, 4)}%)`
      : `(+${stockGrowth.slice(0, 4)}%)`
  }`;
  companyPrice.appendChild(stockGrowthSpan);

  if (previousClose < stockPrice) {
    stockGrowthSpan.classList.remove("red");
    stockGrowthSpan.classList.add("green");
  }
  if (previousClose > stockPrice) {
    stockGrowthSpan.classList.remove("green");
    stockGrowthSpan.classList.add("red");
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

const fetchCompanyHistory = async (symbol, onCompany = true) => {
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
};

const fetchCompanyInfo = async (symbol, onCompany = true) => {
  try {
    if (onCompany) {
      toggleSizeOnFetch();
      companyInfoWithChart.classList.add("d-none");
      spinnerCompany.classList.remove("d-none");
    }
    const response = await fetch(
      `https://stock-
exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
    );
    const responseHistory = await fetchCompanyHistory(symbol, onCompany);
    const data = await response.json();
    if (onCompany) {
      updateCompanyInfo(
        data.profile.image,
        data.profile.companyName,
        data.profile.description,
        data.profile.website,
        responseHistory.historical[1],
        responseHistory.historical[0]
      );
      // fetchCompanyHistory(symbol);
    }
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    if (onCompany) {
      toggleSizeOnFetch();
      companyInfoWithChart.classList.remove("d-none");
      spinnerCompany.classList.add("d-none");
    }
  }
};

const init = () => {
  if (companyInfoWithChart) {
    return fetchCompanyInfo(companySymbol);
  }
};

init();
