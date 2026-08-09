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
