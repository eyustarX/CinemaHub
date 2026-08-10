import "../utils/navbar.js";
import { getCurrentUser } from "../data/auth.js";
import { getBookingsForUser } from "../data/bookings.js";
import { posterUrl } from "../api/tmdb.js";

const root = document.getElementById("bookings-root");

function init() {
  const user = getCurrentUser();

  if (!user) {
    root.innerHTML = `
      <div class="card checkout-card" style="max-width: 500px; text-align: center;">
        <h3>Log in to view your bookings</h3>
        <a href="login.html" class="btn btn-primary" style="margin-top: var(--space-4);">Log In</a>
      </div>
    `;
    return;
  }

  const bookings = getBookingsForUser(user.id);

  if (bookings.length === 0) {
    root.innerHTML = `<p class="state-message">You haven't made any bookings yet.</p>`;
    return;
  }

  render(bookings);
}

function render(bookings) {
  root.innerHTML = `
    <div class="booking-list">
      ${bookings
        .map(
          (booking) => `
        <a href="confirmation.html?ref=${booking.reference}" class="card booking-list-item">
          <img src="${posterUrl(booking.moviePoster, "w185")}" alt="${booking.movieTitle}" />
          <div class="booking-list-item-info">
            <p style="font-weight: 600;">${booking.movieTitle}</p>
            <p class="text-muted" style="font-size: 0.875rem;">
              ${booking.cinemaName} &middot; ${booking.dateLabel} &middot; ${booking.showtimeTime}
            </p>
            <p class="text-muted" style="font-size: 0.875rem;">
              ${booking.seats.length} seat${booking.seats.length > 1 ? "s" : ""} &middot; $${booking.total}
            </p>
            <p class="booking-list-item-ref">${booking.reference}</p>
          </div>
        </a>
      `,
        )
        .join("")}
    </div>
  `;
}

init();
