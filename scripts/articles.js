const API_URL =
  "https://gnews.io/api/v4/top-headlines?apikey=1ce2c4a852a7e71db76121772fdd1453&lang=en";

let articles = [];
let currentPage = 1;
const pageSize = 9;

const articlesGrid = document.getElementById("articles-grid");
const loader = document.getElementById("loader");
const pagination = document.getElementById("pagination");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageLabel = document.getElementById("page-label");

const showLoader = (show) => {
  if (!loader) return;
  loader.style.display = show ? "flex" : "none";
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderArticles = () => {
  articlesGrid.innerHTML = "";

  if (!articles.length) {
    articlesGrid.innerHTML =
      '<p class="empty-message">No articles to show right now.</p>';
    return;
  }

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageArticles = articles.slice(start, end);

  pageArticles.forEach((article) => {
    const {
      title,
      description,
      url,
      image,
      publishedAt,
      source = {},
    } = article;

    const card = document.createElement("article");
    card.className = "article-card";

    const imgSrc =
      image ||
      "https://images.pexels.com/photos/261949/pexels-photo-261949.jpeg?auto=compress&cs=tinysrgb&w=1200";

    card.innerHTML = `
      <div class="article-image-wrapper">
        <img src="${imgSrc}" alt="${
      title || "News image"
    }" class="article-image" />
      </div>
      <div class="article-body">
        <div class="article-meta">
          <span>${source.name || "Unknown source"}</span>
          <span>${formatDate(publishedAt)}</span>
        </div>
        <h2 class="article-title">
          ${title || "Untitled article"}
        </h2>
        <p class="article-description">
          ${description || "No description available for this article."}
        </p>
        <div class="article-footer">
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="article-read-link">
            Read full story →
          </a>
          <span class="article-source-badge">
            ${source.name || "Source"}
          </span>
        </div>
      </div>
    `;

    articlesGrid.appendChild(card);
  });
};

const renderPagination = () => {
  const totalPages = Math.ceil(articles.length / pageSize) || 1;

  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";
  pageLabel.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
};

const render = () => {
  renderArticles();
  renderPagination();
};

const fetchArticles = async () => {
  try {
    showLoader(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log(data);
    articles = data.articles || [];
    currentPage = 1;
    render();
  } catch (error) {
    console.error(error);
    articlesGrid.innerHTML =
      '<p class="error-message">Something went wrong while loading articles. Please try again.</p>';
    pagination.style.display = "none";
  } finally {
    showLoader(false);
  }
};

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(articles.length / pageSize) || 1;
  if (currentPage < totalPages) {
    currentPage += 1;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

fetchArticles();
