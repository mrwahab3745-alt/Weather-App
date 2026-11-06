export function formatWeatherDescription(description = "") {
  return description.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}
