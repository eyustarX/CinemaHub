const STORAGE_KEY = "cinemahub_booking_in_progress";

export function getBookingState() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

/** Merges new fields into the existing booking state without wiping what's already there. */
export function setBookingState(partial) {
  const next = { ...getBookingState(), ...partial };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearBookingState() {
  sessionStorage.removeItem(STORAGE_KEY);
}
