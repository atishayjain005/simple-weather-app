export function temperature(kelvin, celsius = true) {
  if (!Number.isFinite(kelvin)) return "—";
  return Math.round(celsius ? kelvin - 273.15 : (kelvin - 273.15) * 9 / 5 + 32);
}

export function cityTime(timestamp, offset, options = { hour: "2-digit", minute: "2-digit", hour12: false }) {
  if (!Number.isFinite(timestamp) || !Number.isFinite(offset)) return "Unavailable";
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" })
    .format(new Date((timestamp + offset) * 1000));
}
