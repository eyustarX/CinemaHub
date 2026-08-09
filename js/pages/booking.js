import "../utils/navbar.js";
import { getMovieDetails, posterUrl } from "../api/tmdb.js";
import { CINEMAS, getNextDates, getShowtimes } from "../data/cinemas.js";
import { setBookingState } from "../utils/bookingState.js";

const movieId = new URLSearchParams(window.location.search).get("id");

const movieSummaryEl = document.getElementById("movie-summary");
const cinemaOptionsEl = document.getElementById("cinema-options");
const dateStepEl = document.getElementById("date-step");
const dateOptionsEl = document.getElementById("date-options");
const showtimeStepEl = document.getElementById("showtime-step");
const showtimeOptionsEl = document.getElementById("showtime-options");
const continueBtn = document.getElementById("continue-btn");

let selection = { cinemaId: null, dateIso: null, showtimeId: null };
let movie = null;

async function init() {
  if (!movieId) {
    movieSummaryEl.innerHTML = `<p class="state-message is-error">No movie specified.</p>`;
    return;
  }

  try {
    movie = await getMovieDetails(movieId);
    renderMovieSummary(movie);
    renderCinemaOptions();
  } catch (error) {
    console.error("Failed to load movie:", error);
    movieSummaryEl.innerHTML = `<p class="state-message is-error">Unable to load this movie.</p>`;
  }
}

function renderMovieSummary(movie) {
  movieSummaryEl.innerHTML = `
    <img src="${posterUrl(movie.poster_path, "w185")}" alt="${movie.title} poster" />
    <div>
      <h1 class="font-display">${movie.title}</h1>
      <p class="text-muted">${movie.genres.map((g) => g.name).join(", ")}</p>
    </div>
  `;
}

function renderCinemaOptions() {
  cinemaOptionsEl.innerHTML = CINEMAS.map(
    (cinema) => `
    <button class="option-pill" data-cinema-id="${cinema.id}">
      ${cinema.name}
      <span class="pill-subtext">${cinema.location}</span>
    </button>
  `,
  ).join("");

  cinemaOptionsEl.querySelectorAll(".option-pill").forEach((btn) => {
    btn.addEventListener("click", () => selectCinema(btn.dataset.cinemaId));
  });
}

function selectCinema(cinemaId) {
  selection.cinemaId = cinemaId;
  selection.dateIso = null;
  selection.showtimeId = null;
  highlightSelected(cinemaOptionsEl, "cinemaId", cinemaId);

  dateStepEl.hidden = false;
  showtimeStepEl.hidden = true;
  continueBtn.disabled = true;

  renderDateOptions();
}

function renderDateOptions() {
  const dates = getNextDates(7);
  dateOptionsEl.innerHTML = dates
    .map(
      (date) => `
    <button class="option-pill" data-date-iso="${date.iso}">${date.label}</button>
  `,
    )
    .join("");

  dateOptionsEl.querySelectorAll(".option-pill").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectDate(btn.dataset.dateIso, btn.textContent),
    );
  });
}

function selectDate(dateIso, dateLabel) {
  selection.dateIso = dateIso;
  selection.dateLabel = dateLabel;
  selection.showtimeId = null;
  highlightSelected(dateOptionsEl, "dateIso", dateIso);

  showtimeStepEl.hidden = false;
  continueBtn.disabled = true;

  renderShowtimeOptions();
}

function renderShowtimeOptions() {
  const showtimes = getShowtimes(selection.cinemaId, selection.dateIso);
  showtimeOptionsEl.innerHTML = showtimes
    .map(
      (showtime) => `
    <button class="option-pill" data-showtime-id="${showtime.id}" data-time="${showtime.time}">
      ${showtime.time}
    </button>
  `,
    )
    .join("");

  showtimeOptionsEl.querySelectorAll(".option-pill").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectShowtime(btn.dataset.showtimeId, btn.dataset.time),
    );
  });
}

function selectShowtime(showtimeId, time) {
  selection.showtimeId = showtimeId;
  selection.showtimeTime = time;
  highlightSelected(showtimeOptionsEl, "showtimeId", showtimeId);
  continueBtn.disabled = false;
}

function highlightSelected(container, key, value) {
  container.querySelectorAll(".option-pill").forEach((btn) => {
    const matches = btn.dataset[toDatasetKey(key)] === value;
    btn.classList.toggle("is-selected", matches);
  });
}

function toDatasetKey(key) {
  return key;
}

continueBtn.addEventListener("click", () => {
  const cinema = CINEMAS.find((c) => c.id === selection.cinemaId);

  setBookingState({
    movieId: movie.id,
    movieTitle: movie.title,
    moviePoster: movie.poster_path,
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    dateIso: selection.dateIso,
    dateLabel: selection.dateLabel,
    showtimeId: selection.showtimeId,
    showtimeTime: selection.showtimeTime,
  });

  window.location.href = "seats.html";
});

init();
