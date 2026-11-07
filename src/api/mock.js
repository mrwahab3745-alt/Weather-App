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

export function getMockWeather() {
  console.warn("Using mock weather data.");
  const now = Math.floor(Date.now() / 1000);
  const localDate = new Date((now + MOCK_WEATHER.timezone) * 1000)
    .toISOString()
    .slice(0, 10);
  const localMidnight =
    Date.parse(`${localDate}T00:00:00Z`) / 1000 - MOCK_WEATHER.timezone;

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

export function getMockForecast() {
  console.warn("Using mock forecast data.");
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

  return {
    cod: "200",
    message: 0,
    cnt: list.length,
    list,
    city: { timezone: MOCK_WEATHER.timezone },
  };
}
