class Marquee {
  constructor(marqueeDom) {
    this.marqueeDiv = marqueeDom;
    this.i = 0;
    this.fetchedActiveStocks = [];
  }

  fillArray = (arr, value) => {
    arr.push(value);
  };

  fetchActiveStocks = async () => {
    try {
      if (this.fetchedActiveStocks.length === 0) {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/actives?apikey=${apiKey}`
        );
        const data = await response.json();
        data.slice(0, 10).map((stock, index) => {
          this.fillArray(this.fetchedActiveStocks, stock);
        });
      } else {
        this.fetchedActiveStocks.map((stock, index) => {
          this.fillArray(this.fetchedActiveStocks, stock);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  populateMarquee() {
    let stocks = `<h1 class="stock-name">`;
    for (let i = 0; i < this.fetchedActiveStocks.length; ++i) {
      stocks += `<span class="mrl-1">${this.fetchedActiveStocks[i].ticker} ${
        this.fetchedActiveStocks[i].changes < 0
          ? `<span class="red">`
          : `<span class="green">`
      }${this.fetchedActiveStocks[i].changes
        .toString()
        .slice(0, 4)}%</span> </span>`;
    }
    stocks += `</h1>`;
    this.marqueeDiv.innerHTML = stocks;
  }

  onCloneMarqueeH1() {
    this.clonedMarquee = this.marqueeDiv.innerHTML;
    this.firstMarqueeDivElement = this.marqueeDiv.children[0];
    this.marqueeDiv.insertAdjacentHTML("beforeend", this.clonedMarquee);
    this.marqueeDiv.insertAdjacentHTML("beforeend", this.clonedMarquee);
  }

  moveMarquee() {
    setInterval(
      function () {
        this.firstMarqueeDivElement.style.marginLeft = `-${this.i}px`;
        if (this.i > this.firstMarqueeDivElement.clientWidth) {
          this.i = 0;
        }
        this.i = this.i + 0.2;
      }.bind(this),
      0
    );
  }

  async runMarquee() {
    try {
      await this.fetchActiveStocks();
      this.populateMarquee();
      this.onCloneMarqueeH1();
      this.moveMarquee();
    } catch (err) {
      console.log(err);
    }
  }
}
