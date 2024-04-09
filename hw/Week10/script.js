document.addEventListener("DOMContentLoaded", () => {
  /**
   * Asynchronously fetches stock information for a given symbol from the Alpha Vantage API.
   *
   * @param {string} symbol - The stock symbol for which to fetch information.
   * @returns {Promise<Object>} A promise that resolves to an object containing stock information.
   */
  const fetchStockInfo = async (symbol) => {
    symbol = symbol.toUpperCase();

    const apiKey = "M9VGU3FFM5GNSKIS";
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const {
      "Global Quote": {
        "02. open": open,
        "03. high": high,
        "04. low": low,
        "05. price": price,
        "06. volume": volume,
        "09. change": change,
      },
    } = data;

    return { symbol, open, high, low, price, volume, change };
  };

  /**
   * Renders a stock card on the webpage using the provided stock data.
   *
   * @param {Object} stock - The stock data to be displayed on the stock card.
   */
  const renderStockCard = (stock) => {
    const ticker_field = document.getElementById("ticker-symbol");
    const price_field = document.getElementById("stock-price");
    const stock_specs = document.getElementById("stock-specs");
    const change_field = document.getElementById("stock-change");

    // Clear previous data
    ticker_field.textContent = "";
    price_field.textContent = "";
    stock_specs.innerHTML = "";
    change_field.textContent = "";

    ticker_field.append(stock.symbol);
    const stats = `
        <tr>
          <th>Open</th>
          <td>${stock.open}</td>
        </tr>
        <tr>
          <th>High</th>
          <td>${stock.high}</td>
        </tr>
        <tr>
          <th>Low</th>
          <td>${stock.low}</td>
        </tr>
        <tr>
          <th>Volume</th>
          <td>${stock.volume}</td>
        </tr>`;

    stock_specs.insertAdjacentHTML("beforeend", stats);
    price_field.append("$" + stock.price);

    if (parseFloat(stock.change) < 0) {
      change_field.innerHTML = `<span class="material-symbols-outlined large-icon red">south</span>`;
      change_field.classList.add("red");
      change_field.classList.remove("green");
    } else {
      change_field.innerHTML = `<span class="material-symbols-outlined large-icon green">north</span>`;
      change_field.classList.add("green");
      change_field.classList.remove("red");
    }
  };

  /**
   * Adds an event listener to the "search" button to initiate the fetching and rendering
   * process for the entered stock symbol's information.
   */
  document.getElementById("search-btn").addEventListener("click", () => {
    const symbolInput = document.getElementById("symbol-in").value;
    if (symbolInput) {
      fetchStockInfo(symbolInput)
        .then((stock_data) => {
          renderStockCard(stock_data);
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    } else {
      alert("Please enter a stock symbol.");
    }
  });
});
