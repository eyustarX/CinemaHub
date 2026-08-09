import "../utils/navbar.js";
import { getBookingState, setBookingState } from "../utils/bookingState.js";
import { getSeatMap, SEAT_TIERS } from "../data/cinemas.js";
import { posterUrl } from "../api/tmdb.js";

const root = document.getElementById("seats-page-root");
const booking = getBookingState();

let seatMap = [];
let selectedSeats = [];

function init() {
  if (!booking.showtimeId) {
    root.innerHTML = `
      <p class="state-message is-error">
        No showtime selected. Please start from a movie's booking page.
      </p>
    `;
    return;
  }

  seatMap = getSeatMap(booking.showtimeId);
  render();
}

function render() {
  root.innerHTML = `
    <div class="seats-layout">
      <div class="seats-main">
        <p class="screen-label">Screen</p>
        <div class="screen-indicator"></div>

        <div id="seat-grid">
          ${seatMap.map(renderRow).join("")}
        </div>

        <div class="seat-legend">
          <span class="seat-legend-item"><span class="swatch" style="background:var(--seat-available)"></span> Standard $${SEAT_TIERS.standard.price}</span>
          <span class="seat-legend-item"><span class="swatch" style="background:${cssColorMix("premium")}"></span> Premium $${SEAT_TIERS.premium.price}</span>
          <span class="seat-legend-item"><span class="swatch" style="background:${cssColorMix("vip")}"></span> VIP $${SEAT_TIERS.vip.price}</span>
          <span class="seat-legend-item"><span class="swatch" style="background:var(--seat-selected)"></span> Selected</span>
          <span class="seat-legend-item"><span class="swatch" style="background:var(--seat-occupied)"></span> Occupied</span>
        </div>
      </div>

      <aside class="seats-summary card">
        <img src="${posterUrl(booking.moviePoster, "w185")}" alt="${booking.movieTitle}" style="border-radius: var(--radius); margin-bottom: var(--space-4);" />
        <h3 class="font-display">${booking.movieTitle}</h3>
        <div class="summary-row"><span>${booking.cinemaName}</span></div>
        <div class="summary-row"><span>${booking.dateLabel}</span><span>${booking.showtimeTime}</span></div>

        <div class="summary-seats-list" id="summary-seats-list">
          <span class="text-faint">No seats selected yet</span>
        </div>

        <div class="summary-total">
          <span>Total</span>
          <span id="summary-total">$0</span>
        </div>

        <button id="continue-to-checkout" class="btn btn-primary auth-submit" disabled style="margin-top: var(--space-6);">
          Continue to Checkout
        </button>
      </aside>
    </div>
  `;

  document
    .getElementById("seat-grid")
    .addEventListener("click", handleSeatClick);
  document
    .getElementById("continue-to-checkout")
    .addEventListener("click", handleContinue);
}

function renderRow({ row, seats }) {
  return `
    <div class="seat-row">
      <span class="seat-row-label">${row}</span>
      ${seats
        .map(
          (seat) => `
        <button
          class="seat-btn"
          data-seat-id="${seat.id}"
          data-tier="${seat.tier}"
          ${seat.status === "occupied" ? "disabled" : ""}
          aria-label="Seat ${seat.id}, ${seat.tier}, $${seat.price}${seat.status === "occupied" ? ", occupied" : ""}"
        >${seat.number}</button>
      `,
        )
        .join("")}
    </div>
  `;
}

function handleSeatClick(event) {
  const btn = event.target.closest(".seat-btn");
  if (!btn || btn.disabled) return; // click landed outside a seat, or on an occupied one

  const seatId = btn.dataset.seatId;
  const seat = findSeat(seatId);

  const alreadySelected = selectedSeats.some((s) => s.id === seatId);

  if (alreadySelected) {
    selectedSeats = selectedSeats.filter((s) => s.id !== seatId);
    btn.classList.remove("is-selected");
  } else {
    selectedSeats.push(seat);
    btn.classList.add("is-selected");
  }

  updateSummary();
}

function findSeat(seatId) {
  for (const row of seatMap) {
    const seat = row.seats.find((s) => s.id === seatId);
    if (seat) return seat;
  }
  return null;
}

function updateSummary() {
  const listEl = document.getElementById("summary-seats-list");
  const totalEl = document.getElementById("summary-total");
  const continueBtn = document.getElementById("continue-to-checkout");

  if (selectedSeats.length === 0) {
    listEl.innerHTML = `<span class="text-faint">No seats selected yet</span>`;
    totalEl.textContent = "$0";
    continueBtn.disabled = true;
    return;
  }

  listEl.innerHTML = selectedSeats
    .map(
      (s) =>
        `<div class="summary-row"><span>${s.id} (${SEAT_TIERS[s.tier].label})</span><span>$${s.price}</span></div>`,
    )
    .join("");

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  totalEl.textContent = `$${total}`;
  continueBtn.disabled = false;
}

function handleContinue() {
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  setBookingState({
    seats: selectedSeats.map((s) => ({
      id: s.id,
      tier: s.tier,
      price: s.price,
    })),
    total,
  });
  window.location.href = "checkout.html";
}

function cssColorMix(tier) {
  return tier === "vip"
    ? "color-mix(in srgb, var(--seat-vip) 35%, var(--seat-available))"
    : "color-mix(in srgb, var(--accent) 25%, var(--seat-available))";
}

init();
