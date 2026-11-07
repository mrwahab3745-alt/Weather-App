import { requestJson, WeatherApiError } from "./request";

export { WeatherApiError };

async function fetchWeather(type, location, { signal } = {}) {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    const mock = await import("./mock.js");
    return type === "weather" ? mock.getMockWeather() : mock.getMockForecast();
  }

  const params = new URLSearchParams({ type, ...location });
  return requestJson(`/api/weather?${params}`, { signal });
}

export async function fetchWeatherByCity(city, { signal } = {}) {
  return fetchWeather("weather", { q: city }, { signal });
}

export async function fetchWeatherByCoords(lat, lon, { signal } = {}) {
  return fetchWeather("weather", { lat, lon }, { signal });
}

export async function fetchForecastByCity(city, { signal } = {}) {
  return fetchWeather("forecast", { q: city }, { signal });
}

export async function fetchForecastByCoords(lat, lon, { signal } = {}) {
  return fetchWeather("forecast", { lat, lon }, { signal });
}
