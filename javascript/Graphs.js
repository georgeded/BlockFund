let ETHERSCAN_API_KEY = '';

async function loadConfig() {
    try {
        const res = await fetch('/api/config');
        const cfg = await res.json();
        ETHERSCAN_API_KEY = cfg.etherscanKey || '';
    } catch (e) {
        console.error('Failed to load config:', e);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadConfig();

    const toggle = document.getElementById('darkmode-toggle');
    const darkMode = localStorage.getItem('darkMode') === 'true';
    toggle.checked = darkMode;
    applyTheme(darkMode);

    toggle.addEventListener('change', () => {
        const isDarkMode = toggle.checked;
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
        applyTheme(isDarkMode);
    });

    function applyTheme(isDarkMode) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode);

        createChart(isDarkMode);
        createTradingViewWidget(isDarkMode);
        fetchCryptoData();
    }

    function createChart(isDarkMode) {
        const domElement = document.getElementById('tvchart');
        domElement.innerHTML = '';

        const chartProperties = {
            width: domElement.offsetWidth || 800,
            height: 500,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                barSpacing: 100,
                fixLeftEdge: true,
            },
            layout: {
                background: isDarkMode ? { color: 'rgba(40, 40, 40, 0.905)' } : { color: 'rgba(255, 255, 255, 0.905)' },
                textColor: isDarkMode ? 'white' : 'black',
            },
            crossHair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            grid: {
                vertLines: isDarkMode ? { color: 'rgba(40, 40, 40, 0.905)' } : { color: 'rgba(240, 240, 240, 1)' },
                horzLines: isDarkMode ? { color: 'rgba(40, 40, 40, 0.905)' } : { color: 'rgba(240, 240, 240, 1)' },
            },
        };

        const chart = LightweightCharts.createChart(domElement, chartProperties);

        const areaSeries = chart.addAreaSeries({
            topColor: isDarkMode ? 'rgba(0, 150, 136, 0.1)' : 'rgba(0, 150, 136, 0.1)',
            bottomColor: isDarkMode ? 'rgba(0, 150, 136, 0.05)' : 'rgba(0, 150, 136, 0.05)',
            lineColor: isDarkMode ? 'rgba(0, 150, 136, 1)' : 'rgba(0, 150, 136, 1)',
            lineWidth: 3,
            priceLineVisible: false,
        });

        fetchAndProcessData().then(processedData => {
            areaSeries.setData(processedData);
            chart.timeScale().fitContent();
        });
    }

    async function fetchAndProcessData() {
        const address = '0xbC1AA1F461ac8B7359fC833F957c355F19BB4144';
        const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status !== '1') {
                throw new Error(`API Error: ${data.message}`);
            }

            const transactions = data.result;
            return processTransactions(transactions);
        } catch (error) {
            console.log('Error fetching or processing data:', error);
            return [];
        }
    }

    function processTransactions(transactions) {
        const countMap = {};

        transactions.forEach(tx => {
            const date = new Date(tx.timeStamp * 1000);
            const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            if (!countMap[dateString]) {
                countMap[dateString] = 1;
            } else {
                countMap[dateString] += 1;
            }
        });

        let cumulativeCount = 0;
        return Object.keys(countMap)
            .sort()
            .map(date => {
                cumulativeCount += countMap[date];
                return {
                    time: new Date(date).getTime() / 1000,
                    value: cumulativeCount,
                };
            });
    }

    function createTradingViewWidget(isDarkMode) {
        const oldWidgetContainer = document.getElementById('tradingview-widget');
        const newWidgetContainer = oldWidgetContainer.cloneNode(false);
        oldWidgetContainer.parentNode.replaceChild(newWidgetContainer, oldWidgetContainer);

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
        script.type = 'text/javascript';
        script.async = true;

        const widgetConfig = {
            symbols: [
                ["CRYPTOCAP:BTC|All"],
                ["CRYPTOCAP:ETH|All"],
                ["CRYPTOCAP:SOL|All"],
                ["CRYPTOCAP:USDC|All"],
                ["CRYPTOCAP:XRP|All"],
                ["CRYPTOCAP:DOGE|All"],
                ["CRYPTOCAP:BNB|All"],
                ["CRYPTOCAP:PEPE|All"],
                ["CRYPTOCAP:USDT|All"]
            ],
            chartOnly: false,
            width: "100%",
            height: "500",
            locale: "en",
            colorTheme: isDarkMode ? 'dark' : 'light',
            autosize: true,
            showVolume: false,
            showMA: false,
            hideDateRanges: false,
            hideMarketStatus: false,
            hideSymbolLogo: false,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            fontSize: "10",
            noTimeScale: false,
            valuesTracking: "1",
            changeMode: "price-and-percent",
            chartType: "area",
            maLineColor: isDarkMode ? "rgba(178, 181, 190, 1)" : "rgba(0, 0, 0, 0.1)",
            maLineWidth: 1,
            maLength: 9,
            headerFontSize: "medium",
            backgroundColor: isDarkMode ? "rgba(40, 40, 40, 0.905)" : "rgba(255, 255, 255, 0.905)",
            widgetFontColor: isDarkMode ? "white" : "black",
            lineWidth: 2,
            lineType: 0,
            dateRanges: [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ]
        };

        script.innerHTML = JSON.stringify(widgetConfig);
        newWidgetContainer.appendChild(script);
    }

    async function fetchCryptoData() {
        const apiUrl = "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD";
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.Message === "Success") {
                const cryptoTableBody = document.querySelector("#crypto-table tbody");
                cryptoTableBody.innerHTML = ''; // Clear any existing content

                data.Data.forEach((crypto, index) => {
                    const row = document.createElement("tr");

                    const rankCell = document.createElement("td");
                    rankCell.textContent = index + 1;
                    row.appendChild(rankCell);

                    const imageCell = document.createElement("td");
                    const image = document.createElement("img");
                    image.src = `https://www.cryptocompare.com${crypto.CoinInfo.ImageUrl}`;
                    image.alt = crypto.CoinInfo.FullName;
                    imageCell.appendChild(image);
                    row.appendChild(imageCell);

                    const symbolCell = document.createElement("td");
                    symbolCell.textContent = crypto.CoinInfo.Name;
                    row.appendChild(symbolCell);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = crypto.CoinInfo.FullName;
                    row.appendChild(nameCell);

                    const priceCell = document.createElement("td");
                    priceCell.textContent = `$${parseFloat(crypto.RAW.USD.PRICE).toFixed(10)}`;
                    row.appendChild(priceCell);

                    const volumeCell = document.createElement("td");
                    volumeCell.textContent = `$${parseFloat(crypto.RAW.USD.TOTALVOLUME24HTO).toFixed(2)}`;
                    row.appendChild(volumeCell);

                    cryptoTableBody.appendChild(row);
                });
            } else {
                console.error("Failed to fetch cryptocurrency data:", data.Message);
            }
        } catch (error) {
            console.error("Error fetching cryptocurrency data:", error);
        }
    }
});
