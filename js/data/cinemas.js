export const CINEMAS = [
  { id: "downtown", name: "CinemaHub Downtown", location: "4th & Main St" },
  {
    id: "westside",
    name: "CinemaHub Westside Mall",
    location: "Westside Mall, Level 2",
  },
  { id: "riverside", name: "CinemaHub Riverside", location: "Riverside Plaza" },
];

const DAILY_TIMES = ["12:30 PM", "3:15 PM", "6:00 PM", "8:45 PM"];

export function getNextDates(days = 7) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      iso: date.toISOString().slice(0, 10), // "2026-08-09"
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  }

  return dates;
}

export function getShowtimes(cinemaId, dateIso) {
  return DAILY_TIMES.map((time, i) => ({
    id: `${cinemaId}-${dateIso}-${i}`,
    time,
  }));
}

export const SEAT_TIERS = {
  standard: { label: "Standard", price: 12 },
  premium: { label: "Premium", price: 18 },
  vip: { label: "VIP", price: 26 },
};

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 10;

function tierForRow(row) {
  if (["A", "B"].includes(row)) return "standard";
  if (["G", "H"].includes(row)) return "vip";
  return "premium";
}

export function getSeatMap(showtimeId) {
  const occupiedSet = getDeterministicOccupiedSeats(showtimeId);

  return ROWS.map((row) => {
    const tier = tierForRow(row);
    const seats = [];
    for (let i = 1; i <= SEATS_PER_ROW; i++) {
      const seatId = `${row}${i}`;
      seats.push({
        id: seatId,
        row,
        number: i,
        tier,
        price: SEAT_TIERS[tier].price,
        status: occupiedSet.has(seatId) ? "occupied" : "available",
      });
    }
    return { row, tier, seats };
  });
}

function getDeterministicOccupiedSeats(showtimeId) {
  let hash = 0;
  for (const char of showtimeId) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10000;
  }

  const occupied = new Set();
  const allSeatIds = ROWS.flatMap((row) =>
    Array.from({ length: SEATS_PER_ROW }, (_, i) => `${row}${i + 1}`),
  );

  const occupiedCount = Math.floor(allSeatIds.length * 0.2);
  let seed = hash;
  for (let i = 0; i < occupiedCount; i++) {
    seed = (seed * 9301 + 49297) % 233280; // simple linear congruential generator
    const index = seed % allSeatIds.length;
    occupied.add(allSeatIds[index]);
  }

  return occupied;
}
