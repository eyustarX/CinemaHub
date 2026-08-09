import "../utils/navbar.js";
import { getMovieDetails, posterUrl, backdropUrl } from "../api/tmdb.js";

const root = document.getElementById("movie-detail-root");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function init() {
  if (!movieId) {
    root.innerHTML = `<p class="state-message is-error">No movie specified.</p>`;
    return;
  }

  try {
    const movie = await getMovieDetails(movieId);
    render(movie);
  } catch (error) {
    console.error("Failed to load movie details:", error);
    root.innerHTML = `<p class="state-message is-error">Unable to load this movie. Try again.</p>`;
  }
}

function render(movie) {
  const trailer = findTrailer(movie.videos?.results ?? []);
  const cast = (movie.credits?.cast ?? []).slice(0, 12);
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  root.innerHTML = `
    <div class="detail-header">
      <img class="detail-poster" src="${posterUrl(movie.poster_path)}" alt="${movie.title} poster" />
      <div class="detail-info">
        <h1 class="font-display">${movie.title}</h1>
        <div class="detail-meta">
          <span>${movie.release_date?.slice(0, 4) ?? "—"}</span>
          <span>${hours}h ${minutes}m</span>
          <span>★ ${movie.vote_average.toFixed(1)}</span>
          <span>${movie.genres.map((g) => g.name).join(", ")}</span>
        </div>
        <p class="detail-overview text-muted">${movie.overview}</p>
        <a href="booking.html?id=${movie.id}" class="btn btn-primary">Book Tickets</a>
      </div>
    </div>

    ${
      trailer
        ? `
      <h2 class="font-display section-title">Trailer</h2>
      <div class="trailer-wrap">
        <iframe
          src="https://www.youtube.com/embed/${trailer.key}"
          title="${movie.title} trailer"
          allowfullscreen
        ></iframe>
      </div>
    `
        : ""
    }

    ${
      cast.length
        ? `
      <h2 class="font-display section-title">Cast</h2>
      <div class="cast-grid">
        ${cast
          .map(
            (person) => `
          <div>
            <img
              class="cast-photo"
              src="${posterUrl(person.profile_path, "w185") ?? ""}"
              alt="${person.name}"
              loading="lazy"
            />
            <p class="cast-name">${person.name}</p>
            <p class="cast-character">${person.character}</p>
          </div>
        `,
          )
          .join("")}
      </div>
    `
        : ""
    }
  `;
}

function findTrailer(videos) {
  return videos.find((v) => v.type === "Trailer" && v.site === "YouTube");
}

init();
