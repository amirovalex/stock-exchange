const fetchedActiveStocks = [];
// const marquee = document.getElementsByClassName("marquee")[0];
// const marqueeSpan = document.getElementById("marqueeSpan");
// const marqueeSpanContainer = document.getElementById("marqueeSpanContainer");
// console.log(marqueeSpanContainer);
const fillArray = (arr, value) => {
  arr.push(value);
};

function populateMarquee(selector, stock) {
  console.log("ticker", stock.ticker);
  const marquee = document.querySelector(`.${selector}`);
  tempInner = marquee.innerText;
  console.log(tempInner);
  let stocks = "";
  //   for (let i = 0; i < 40; ++i) {
  //   debugger;
  stocks += `<h1 class="stock-name"> ${
    stock.ticker
  } <span class="stock-price">${stock.changes
    .toString()
    .slice(0, 4)}</span></h1>`;
  //   }
  marquee.innerHTML = stocks;
  console.log(marquee);
  console.log(stock);
  const marqueeHTML = marquee.innerHTML;
  marquee.insertAdjacentHTML("beforeend", stocks);
}

function Marquee(selector, speed, stock) {
  //   populateMarquee("marquee", stock);
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = 0;
  console.log(firstElement);
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

//after window is completed load
//1 class selector for marquee
//2 marquee speed 0.2
// window.addEventListener("load", Marquee(".marquee", 0.2));

const fetchActiveStocks = async () => {
  try {
    if (fetchedActiveStocks.length === 0) {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/actives?apikey=${apiKey}`
      );
      const data = await response.json();
      console.log(data);
      data.slice(0, 10).map((stock, index) => {
        fillArray(fetchedActiveStocks, stock);
        populateMarquee("marquee", stock);
      });
      Marquee(".marquee", 0.2, fetchedActiveStocks);
    } else {
      fetchedActiveStocks.map((stock, index) => {
        fillArray(fetchedActiveStocks, stock);
        populateMarquee("marquee", stock, fe);
      });
      Marquee(".marquee", 0.2, fetchedActiveStocks);
    }
  } catch (err) {
    console.log(err);
  }
};

fetchActiveStocks();
