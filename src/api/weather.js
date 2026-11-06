// OpenWeatherMap API Base URL & Key setup
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY?.trim() ?? "";
const API_KEY_PLACEHOLDER = /^(your_key_here|my_api_key_here)$/i;

export class WeatherApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "WeatherApiError";
    this.code = code;
  }
}

const MOCK_WEATHER = {
  coord: { lon: 74.3587, lat: 31.5204 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  base: "stations",
  main: {
    temp: 27,
    feels_like: 27,
    temp_min: 25,
    temp_max: 29,
    pressure: 1012,
    humidity: 45,
  },
  visibility: 10000,
  wind: { speed: 12, deg: 240 },
  clouds: { all: 0 },
  sys: { country: "PK" },
  timezone: 18000,
  name: "Lahore",
};

function hasUsableApiKey() {
  return API_KEY.length > 0 && !API_KEY_PLACEHOLDER.test(API_KEY);
}

function getMockWeather(reason) {
  console.warn(`Using mock weather data: ${reason}.`);
  const now = Math.floor(Date.now() / 1000);
  const localDate = new Date((now + MOCK_WEATHER.timezone) * 1000)
    .toISOString()
    .slice(0, 10);
  const localMidnight = Date.parse(`${localDate}T00:00:00Z`) / 1000 -
    MOCK_WEATHER.timezone;

  return {
    ...MOCK_WEATHER,
    main: { ...MOCK_WEATHER.main },
    weather: MOCK_WEATHER.weather.map((condition) => ({ ...condition })),
    sys: {
      ...MOCK_WEATHER.sys,
      sunrise: localMidnight + 6 * 60 * 60,
      sunset: localMidnight + 18 * 60 * 60,
    },
    wind: { ...MOCK_WEATHER.wind },
    clouds: { ...MOCK_WEATHER.clouds },
    dt: now,
  };
}

function getMockForecast(reason) {
  console.warn(`Using mock forecast data: ${reason}.`);
  const now = new Date();
  const list = Array.from({ length: 5 }, (_, index) => {
    const forecastDate = new Date(now);
    forecastDate.setUTCDate(forecastDate.getUTCDate() + index + 1);
    forecastDate.setUTCHours(12, 0, 0, 0);

    return {
      dt: Math.floor(forecastDate.getTime() / 1000),
      dt_txt: forecastDate.toISOString().replace("T", " ").slice(0, 19),
      main: { temp: 27 - index, feels_like: 26 - index },
      weather: MOCK_WEATHER.weather.map((condition) => ({ ...condition })),
    };
  });

  return { cod: "200", message: 0, cnt: list.length, list };
}

async function fetchWeather(url, mockData) {
  if (!hasUsableApiKey()) {
    if (import.meta.env.DEV) {
      return mockData();
    }
    throw new Error(
      "VITE_WEATHER_API_KEY is missing or is a placeholder. Configure it to fetch weather data."
    );
  }

  let res;
  try {
    res = await fetch(url);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new WeatherApiError(
        "No internet connection. Please check your network.",
        "NETWORK"
      );
    }
    throw error;
  }

  if (res.status === 404) {
    throw new WeatherApiError(
      "City not found. Please check the spelling and try again.",
      "NOT_FOUND"
    );
  }
  if (res.status === 401) {
    throw new WeatherApiError(
      "Weather service is temporarily unavailable. Please try again later.",
      "UNAUTHORIZED"
    );
  }
  if (res.status === 429) {
    throw new WeatherApiError(
      "Too many requests. Please wait a minute and try again.",
      "RATE_LIMITED"
    );
  }
  if (!res.ok) {
    throw new WeatherApiError(
      "Server error. Please try again later.",
      "SERVER"
    );
  }

  return res.json();
}

// 1. City se Weather Mangaana
export async function fetchWeatherByCity(city) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  return fetchWeather(url, () =>
    getMockWeather("VITE_WEATHER_API_KEY is missing or is a placeholder")
  );
}

// 2. Coordinates (Latitude/Longitude) se Weather Mangaana
export async function fetchWeatherByCoords(lat, lon) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  return fetchWeather(url, () =>
    getMockWeather("VITE_WEATHER_API_KEY is missing or is a placeholder")
  );
}

// 3. Weather Icon Helper
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
// 5-Day Forecast Data Fetcher
export async function fetchForecastByCity(city) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  return fetchWeather(url, () =>
    getMockForecast("VITE_WEATHER_API_KEY is missing or is a placeholder")
  );
}