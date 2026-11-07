export class WeatherApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "WeatherApiError";
    this.code = code;
  }
}

const ERROR_MESSAGES = {
  BAD_REQUEST: "Please enter a valid city name.",
  NETWORK: "No internet connection. Please check your network.",
  NOT_FOUND: "City not found. Please check the spelling and try again.",
  RATE_LIMITED: "Too many requests. Please wait a minute and try again.",
  SERVER: "Weather service is temporarily unavailable. Please try again later.",
};

function serverError() {
  return new WeatherApiError(ERROR_MESSAGES.SERVER, "SERVER");
}

async function fetchWeather(type, location, { signal } = {}) {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    const mock = await import("./mock.js");
    return type === "weather" ? mock.getMockWeather() : mock.getMockForecast();
  }

  const params = new URLSearchParams({ type, ...location });
  let response;
  try {
    response = await fetch(`/api/weather?${params}`, { signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new WeatherApiError(ERROR_MESSAGES.NETWORK, "NETWORK");
    }
    throw serverError();
  }

  if (response.status === 400) {
    throw new WeatherApiError(ERROR_MESSAGES.BAD_REQUEST, "BAD_REQUEST");
  }
  if (response.status === 404) {
    throw new WeatherApiError(ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
  }
  if (response.status === 401) {
    throw new WeatherApiError(ERROR_MESSAGES.SERVER, "UNAUTHORIZED");
  }
  if (response.status === 429) {
    throw new WeatherApiError(ERROR_MESSAGES.RATE_LIMITED, "RATE_LIMITED");
  }
  if (response.status >= 500) {
    throw serverError();
  }
  if (!response.ok) {
    throw serverError();
  }

  try {
    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }
    throw serverError();
  }
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
