import "../utils/navbar.js";
import { getBookingState, clearBookingState } from "../utils/bookingState.js";
import { getCurrentUser } from "../data/auth.js";
import { createBooking } from "../data/bookings.js";
import { posterUrl } from "../api/tmdb.js";

const root = document.getElementById("checkout-root");
const booking = getBookingState();

function init() {
  if (!booking.seats || booking.seats.length === 0) {
    root.innerHTML = `<p class="state-message is-error">No seats selected. Please start from a movie's booking page.</p>`;
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    root.innerHTML = `
      <div class="card checkout-card" style="max-width: 500px; margin-inline: auto; text-align: center;">
        <h3>Log in to continue</h3>
        <p class="text-muted" style="margin-bottom: var(--space-6);">
          You'll need an account to save this booking.
        </p>
        <a href="login.html" class="btn btn-primary">Log In</a>
      </div>
    `;
    return;
  }

  render(user);
}

function render(user) {
  root.innerHTML = `
    <div class="checkout-layout">
      <div class="card checkout-card">
        <h3>Order Summary</h3>
        <div class="checkout-detail-row"><span>Movie</span><span>${booking.movieTitle}</span></div>
        <div class="checkout-detail-row"><span>Cinema</span><span>${booking.cinemaName}</span></div>
        <div class="checkout-detail-row"><span>Date</span><span>${booking.dateLabel}</span></div>
        <div class="checkout-detail-row"><span>Time</span><span>${booking.showtimeTime}</span></div>
        <div class="checkout-detail-row"><span>Seats</span><span>${booking.seats.map((s) => s.id).join(", ")}</span></div>
        <div class="checkout-total-row"><span>Total</span><span>$${booking.total}</span></div>
      </div>

      <div class="checkout-notice">
        This is a simulated booking — no real payment is processed. Clicking
        "Confirm Booking" reserves your seats and generates a booking reference.
      </div>

      <button id="confirm-btn" class="btn btn-primary auth-submit">Confirm Booking</button>
    </div>
  `;

  document
    .getElementById("confirm-btn")
    .addEventListener("click", () => handleConfirm(user));
}

function handleConfirm(user) {
  const confirmBtn = document.getElementById("confirm-btn");
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Confirming…";

  const savedBooking = createBooking({
    userId: user.id,
    movieId: booking.movieId,
    movieTitle: booking.movieTitle,
    moviePoster: booking.moviePoster,
    cinemaName: booking.cinemaName,
    dateLabel: booking.dateLabel,
    showtimeTime: booking.showtimeTime,
    seats: booking.seats,
    total: booking.total,
  });

  clearBookingState();
  window.location.href = `confirmation.html?ref=${savedBooking.reference}`;
}

init();
