// OpenWeatherMap API key. Replace with your own key from https://openweathermap.org/api
// Sign up for a free account and paste the key here.
// You can also set it via Vite's import.meta.env by creating a .env file:
//   VITE_OWM_API_KEY=your_key_here
const API_KEY =
  import.meta.env.VITE_OWM_API_KEY || "2b4a5f1ec7b9e476c5d84f7fba5d32ca";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeatherByCity(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("City not found");
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function fetchWeatherByCoords(lat, lon) {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Unable to fetch weather for your location");
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
