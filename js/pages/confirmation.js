import "../utils/navbar.js";
import { getBookingByReference } from "../data/bookings.js";
import { posterUrl } from "../api/tmdb.js";

const root = document.getElementById("confirmation-root");
const reference = new URLSearchParams(window.location.search).get("ref");

function init() {
  const booking = reference ? getBookingByReference(reference) : null;

  if (!booking) {
    root.innerHTML = `<p class="state-message is-error">Booking not found.</p>`;
    return;
  }

  render(booking);
}

function render(booking) {
  root.innerHTML = `
    <div class="ticket">
      <div class="ticket-header">
        <div class="ticket-check">✓</div>
        <h1 class="font-display">Booking Confirmed</h1>
        <p class="text-muted">${booking.movieTitle}</p>
        <p class="ticket-reference font-mono">${booking.reference}</p>
      </div>

      <div class="ticket-perforation"></div>

      <div class="ticket-body">
        <div class="ticket-row"><span>Cinema</span><span>${booking.cinemaName}</span></div>
        <div class="ticket-row"><span>Date</span><span>${booking.dateLabel}</span></div>
        <div class="ticket-row"><span>Time</span><span>${booking.showtimeTime}</span></div>
        <div class="ticket-row"><span>Seats</span><span>${booking.seats.map((s) => s.id).join(", ")}</span></div>
        <div class="ticket-row"><span>Total Paid</span><span>$${booking.total}</span></div>
      </div>
    </div>

    <div class="ticket-actions">
      <a href="my-bookings.html" class="btn btn-primary">View My Bookings</a>
      <a href="index.html" class="btn btn-secondary">Back to Home</a>
    </div>
  `;
}

init();
