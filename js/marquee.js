const fetchedActiveStocks = [];
const fillArray = (arr, value) => {
  arr.push(value);
};

function populateMarquee(selector, stockArray) {
  const marquee = document.querySelector(`.${selector}`);
  let stocks = `<h1 class="stock-name">`;
  for (let i = 0; i < stockArray.length; ++i) {
    stocks += `<span class="mrl-1">${stockArray[i].ticker} ${
      stockArray[i].changes < 0 ? `<span class="red">` : `<span class="green">`
    }${stockArray[i].changes.toString().slice(0, 4)}%</span> </span>`;
  }
  stocks += `</h1>`;
  marquee.innerHTML = stocks;
}

function Marquee(selector, speed, stock) {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = 0;
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);

  setInterval(function () {
    firstElement.style.marginLeft = `-${i}px`;
    if (i > firstElement.clientWidth) {
      i = 0;
    }
    i = i + speed;
  }, 0);
}

const fetchActiveStocks = async () => {
  try {
    if (fetchedActiveStocks.length === 0) {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/actives?apikey=${apiKey}`
      );
      const data = await response.json();
      data.slice(0, 10).map((stock, index) => {
        fillArray(fetchedActiveStocks, stock);
      });
      populateMarquee("marquee", fetchedActiveStocks);
      Marquee(".marquee", 0.2);
    } else {
      fetchedActiveStocks.map((stock, index) => {
        fillArray(fetchedActiveStocks, stock);
      });
      populateMarquee("marquee", fetchedActiveStocks);
      Marquee(".marquee", 0.2, fetchedActiveStocks);
    }
  } catch (err) {
    console.log(err);
  }
};

fetchActiveStocks();
