import { getPopularMovies, posterUrl, backdropUrl } from "../api/tmdb.js";

const hero = document.getElementById("hero");
const grid = document.getElementById("popular-grid");

async function initHomePage() {
  renderLoading();
  try {
    const movies = await getPopularMovies();
    renderHero(movies[0]);
    renderGrid(movies.slice(1, 13));
  } catch (error) {
    console.error("Failed to load popular movies:", error);
    renderError();
  }
}

function renderLoading() {
  grid.innerHTML = `<p class="state-message">Loading movies…</p>`;
}

function renderError() {
  grid.innerHTML = `<p class="state-message is-error">Unable to load movies. Try again.</p>`;
}

function renderHero(movie) {
  if (!movie) return;
  hero.style.backgroundImage = `
    linear-gradient(180deg, rgba(11,13,18,0.15) 0%, var(--bg) 95%),
    url(${backdropUrl(movie.backdrop_path)})
  `;
  hero.querySelector(".hero-title").textContent = movie.title;
  hero.querySelector(".hero-overview").textContent = movie.overview;
  hero.querySelector(".hero-cta").href = `movie-details.html?id=${movie.id}`;
}

function renderGrid(movies) {
  if (movies.length === 0) {
    grid.innerHTML = `<p class="state-message">No movies found.</p>`;
    return;
  }

  grid.innerHTML = movies
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
}

initHomePage();
