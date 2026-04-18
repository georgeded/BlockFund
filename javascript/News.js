let CRYPTOCOMPARE_API_KEY = '';
async function loadConfig() {
    try {
        const res = await fetch('/api/config');
        const cfg = await res.json();
        CRYPTOCOMPARE_API_KEY = cfg.cryptoCompareKey || '';
    } catch (e) {
        console.error('Failed to load config:', e);
    }
}

const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";
        const fetchInterval = 60000;
        const articlesPerPage = 15;
        let currentPage = 1;
        let articles = [];

        // Function to truncate text
        function truncateText(text, wordLimit) {
            const words = text.split(' ');
            if (words.length > wordLimit) {
                return words.slice(0, wordLimit).join(' ') + '...';
            }
            return text;
        }

        // Function to fetch and display news
        async function fetchCryptoNews() {
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.Type === 100) {
                    articles = data.Data;
                    displayPage(currentPage);
                } else {
                    console.error("Failed to fetch news");
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        }

        function displayPage(pageNumber) {
            const newsContainer = document.getElementById('news-container');
            const paginationContainer = document.getElementById('pagination');
            newsContainer.innerHTML = ''; // Clear existing news

            const startIndex = (pageNumber - 1) * articlesPerPage;
            const endIndex = Math.min(startIndex + articlesPerPage, articles.length);

            for (let i = startIndex; i < endIndex; i++) {
                const article = articles[i];
                const articleDiv = document.createElement('div');
                articleDiv.className = 'news-article';

                const publishedDate = new Date(article.published_on * 1000).toLocaleString();
                const truncatedBody = truncateText(article.body, 18); // Limit to 20 words

                articleDiv.innerHTML = `
                    <a href="${article.url}" target="_blank" class="news-source">
                        ${article.imageurl ? `<img src="${article.imageurl}" alt="${article.source}">` : ''}
                        <div class="news-content" style="margin-top: -1%;">
                            <div style="text-align: left;">
                                <h2>${article.title}</h2>
                                <p>${truncatedBody}</p>
                            </div>
                            <div class="bottom-info">
                                <div>
                                    <p style="text-align: left; margin: 0;"><small>Source: ${article.source}</small></p>
                                </div>
                                <div>
                                    <p style="text-align: right; margin: 0;"><small>Published on: ${publishedDate}</small></p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <hr>
                `;

                newsContainer.appendChild(articleDiv);
            }

            updatePagination();
            window.scrollTo(0, 0); // Scroll to the top of the page
        }

        function updatePagination() {
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';

            const totalPages = Math.ceil(articles.length / articlesPerPage);

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.disabled = i === currentPage;
                button.addEventListener('click', () => {
                    currentPage = i;
                    displayPage(currentPage);
                });
                paginationContainer.appendChild(button);
            }
        }

        // Fetch news initially (after config loads)
        loadConfig().then(() => {
            fetchCryptoNews();
            setInterval(fetchCryptoNews, fetchInterval);
        });