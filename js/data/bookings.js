const BOOKINGS_KEY = "cinemahub_bookings";

function getAllBookings() {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
}

function saveAllBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function createBooking(details) {
  const booking = {
    id: crypto.randomUUID(),
    reference: generateReference(),
    createdAt: new Date().toISOString(),
    ...details,
  };

  const bookings = getAllBookings();
  saveAllBookings([...bookings, booking]);

  return booking;
}

export function getBookingsForUser(userId) {
  return getAllBookings()
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getBookingByReference(reference) {
  return getAllBookings().find((b) => b.reference === reference) ?? null;
}

function generateReference() {
  const random = crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase();
  return `CH-${random}`;
}
