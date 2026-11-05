// OpenWeatherMap API Base URL & Key setup
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Key check helper
const checkApiKey = () => {
  if (!API_KEY || API_KEY === "your_key_here") {
    throw new Error("API Key missing! Please configure VITE_WEATHER_API_KEY in your .env file.");
  }
};

// 1. City se Weather Mangaana
export async function fetchWeatherByCity(city) {
  checkApiKey();
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error("City not found. Please check spelling.");
    if (res.status === 401) throw new Error("Invalid API key. Check OpenWeatherMap account.");
    throw new Error("Server error. Please try again later.");
  }
  return res.json();
}

// 2. Coordinates (Latitude/Longitude) se Weather Mangaana
export async function fetchWeatherByCoords(lat, lon) {
  checkApiKey();
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Unable to fetch location weather.");
  return res.json();
}

// 3. Weather Icon Helper
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
// 5-Day Forecast Data Fetcher
export async function fetchForecastByCity(city) {
  checkApiKey();
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Unable to fetch forecast data.");
  return res.json();
}