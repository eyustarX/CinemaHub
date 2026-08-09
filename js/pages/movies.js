import {
  getGenres,
  discoverMovies,
  searchMovies,
  posterUrl,
} from "../api/tmdb.js";

const grid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");
const genreSelect = document.getElementById("genre-select");
const sortSelect = document.getElementById("sort-select");
const loadMoreBtn = document.getElementById("load-more-btn");

let state = {
  query: "",
  genreId: "",
  sortBy: "popularity.desc",
  page: 1,
  totalPages: 1,
};

async function init() {
  await loadGenres();
  await loadMovies({ reset: true });

  searchInput.addEventListener("input", debounce(handleSearchInput, 400));
  genreSelect.addEventListener("change", handleFilterChange);
  sortSelect.addEventListener("change", handleFilterChange);
  loadMoreBtn.addEventListener("click", handleLoadMore);
}

async function loadGenres() {
  const genres = await getGenres();
  genreSelect.insertAdjacentHTML(
    "beforeend",
    genres.map((g) => `<option value="${g.id}">${g.name}</option>`).join(""),
  );
}

async function loadMovies({ reset }) {
  if (reset) {
    grid.innerHTML = `<p class="state-message">Loading movies…</p>`;
    state.page = 1;
  }

  try {
    const { results, totalPages } = state.query
      ? await searchMovies(state.query, state.page)
      : await discoverMovies({
          page: state.page,
          genreId: state.genreId,
          sortBy: state.sortBy,
        });

    state.totalPages = totalPages;
    renderGrid(results, { reset });
    loadMoreBtn.style.display =
      state.page >= totalPages ? "none" : "inline-flex";
  } catch (error) {
    console.error("Failed to load movies:", error);
    grid.innerHTML = `<p class="state-message is-error">Unable to load movies. Try again.</p>`;
  }
}

function renderGrid(movies, { reset }) {
  if (reset && movies.length === 0) {
    grid.innerHTML = `<p class="state-message">No movies found.</p>`;
    return;
  }

  const cardsHtml = movies
    .map((movie) => {
      const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
      return `
      <a class="card movie-card" href="movie-details.html?id=${movie.id}">
        <img src="${posterUrl(movie.poster_path)}" alt="${movie.title} poster" loading="lazy" />
        <div class="movie-card-info">
          <p class="movie-card-title">${movie.title}</p>
          <p class="movie-card-meta">${year} &middot; ★ ${movie.vote_average.toFixed(1)}</p>
        </div>
      </a>
    `;
    })
    .join("");

  grid.innerHTML = reset ? cardsHtml : grid.innerHTML + cardsHtml;
}

function handleSearchInput(event) {
  state.query = event.target.value.trim();
  loadMovies({ reset: true });
}

function handleFilterChange() {
  state.genreId = genreSelect.value;
  state.sortBy = sortSelect.value;
  loadMovies({ reset: true });
}

function handleLoadMore() {
  state.page += 1;
  loadMovies({ reset: false });
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

init();
