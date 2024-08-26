let chartInstance = null; // Variable to hold the Chart.js instance

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Load the theme from local storage if available
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggle.checked = false;
  }

  // Toggle the theme on switch change
  themeToggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode");

    // Save the theme preference
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".toggle-button");
  const content = document.querySelector(".expandable-content");

  button.addEventListener("click", function () {
    if (content.style.display === "block") {
      content.style.display = "none";
      button.textContent = "More Info";
    } else {
      content.style.display = "block";
      button.textContent = "Less Info";
    }
  });
});

document
  .getElementById("investment-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const purchasePrice = parseFloat(
      document.getElementById("purchasePrice").value
    );
    const currentPrice = parseFloat(
      document.getElementById("currentPrice").value
    );
    const yearsOwned = parseInt(document.getElementById("yearsOwned").value);

    const cdInterestRate = parseInt(document.getElementById("cd").value) / 100;

    const sp500GrowthRate =
      parseInt(document.getElementById("sp500").value) / 100;

    const growthRate = (currentPrice / purchasePrice) ** (1 / yearsOwned) - 1;

    let finalSp500 = purchasePrice * (1 + sp500GrowthRate) ** yearsOwned;

    let finalCD = purchasePrice * (1 + cdInterestRate) ** yearsOwned;

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const finalStatement = document.getElementById("valueCalculation");
    const finalRate = document.getElementById("rateCalculation");

    finalRate.textContent = "";

    finalRate.textContent = `Your home's annualized return rate over ${yearsOwned} years is ${(
      growthRate * 100
    ).toFixed(2)}%`;

    finalStatement.textContent = "";

    if (currentPrice > finalSp500 && currentPrice > finalCD) {
      let gainVsSp500 = currentPrice - finalSp500;
      let gainVsCD = currentPrice - finalCD;
      gainVsSp500 = formatter.format(gainVsSp500);
      gainVsCD = formatter.format(gainVsCD);
      finalStatement.textContent = `Yes! Your home is worth ${gainVsSp500} more than an investment in the S&P 500 and ${gainVsCD} more than a CD. 💰`;
    }

    if (currentPrice < finalSp500 && currentPrice > finalCD) {
      let lossVsSp500 = currentPrice - finalSp500;
      let gainVsCD = currentPrice - finalCD;
      lossVsSp500 = formatter.format(lossVsSp500);
      gainVsCD = formatter.format(gainVsCD);
      finalStatement.textContent = `No! Your home is worth ${lossVsSp500} less than an investment in the S&P 500, but ${gainVsCD} more than a CD. 📉`;
    }

    if (currentPrice > finalSp500 && currentPrice < finalCD) {
      let gainVsSp500 = currentPrice - finalSp500;
      let lossVsCD = currentPrice - finalCD;
      gainVsSp500 = formatter.format(gainVsSp500);
      lossVsCD = formatter.format(lossVsCD);
      finalStatement.textContent = `No! Your home is worth ${lossVsCD} less than a CD, but ${gainVsSp500} more than an investment in the S&P 500. 📉`;
    }

    if (currentPrice < finalSp500 && currentPrice < finalCD) {
      let lossVsSp500 = currentPrice - finalSp500;
      let lossVsCD = currentPrice - finalCD;
      lossVsSp500 = formatter.format(lossVsSp500);
      lossVsCD = formatter.format(lossVsCD);
      finalStatement.textContent = `No! Your home is worth ${lossVsSp500} less than an investment in the S&P 500 and ${lossVsCD} less than a CD 📉`;
    }

    createChart();

    function createChart() {
      const labels = [];
      const housePrices = [];
      const cdValues = [];
      const sp500Values = [];

      for (let year = 0; year <= yearsOwned; year++) {
        labels.push(year);

        // Calculate house price
        housePrices.push(purchasePrice * (1 + growthRate) ** year);

        // Calculate CD value
        cdValues.push(purchasePrice * (1 + cdInterestRate) ** year);

        // Calculate S&P 500 value
        sp500Values.push(purchasePrice * (1 + sp500GrowthRate) ** year);
      }

      const ctx = document.getElementById("investmentChart").getContext("2d");

      // Destroy existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart instance
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "House Price",
              data: housePrices,
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              fill: true,
            },
            {
              label: "CD Investment",
              data: cdValues,
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              fill: true,
            },
            {
              label: "S&P 500 Investment",
              data: sp500Values,
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Years",
              },
            },
            y: {
              title: {
                display: true,
                text: "Value",
              },
            },
          },
        },
      });
    }
  });
