const ALLOWED_KEYS = new Set(["type", "q", "lat", "lon"]);
const CITY_PATTERN = /^[\p{L}\p{M}\s.,'’-]{1,80}$/u;

function failure(message) {
  return { ok: false, message };
}

export function parseWeatherQuery(searchParams) {
  for (const key of searchParams.keys()) {
    if (!ALLOWED_KEYS.has(key)) {
      return failure("Unsupported query parameter.");
    }
    if (searchParams.getAll(key).length !== 1) {
      return failure("Each query parameter must be provided once.");
    }
  }

  const type = searchParams.get("type");
  if (type !== "weather" && type !== "forecast" && type !== "geocode") {
    return failure("Type must be weather, forecast, or geocode.");
  }

  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (type === "geocode") {
    if (q === null || lat !== null || lon !== null) {
      return failure("Geocoding requires a city name only.");
    }

    const city = q.trim().replace(/\s+/gu, " ");
    if (city.length < 2 || city.length > 80 || !CITY_PATTERN.test(city)) {
      return failure("City must be 2-80 valid characters.");
    }
    return { ok: true, endpoint: type, params: { q: city } };
  }

  const hasCity = q !== null;
  const hasAnyCoordinates = lat !== null || lon !== null;

  if (hasCity === hasAnyCoordinates || (hasAnyCoordinates && (lat === null || lon === null))) {
    return failure("Provide either a city or both coordinates.");
  }

  if (hasCity) {
    const city = q.trim();
    if (!CITY_PATTERN.test(city)) {
      return failure("City must be 1-80 valid characters.");
    }
    return { ok: true, endpoint: type, params: { q: city } };
  }

  const latitude = Number(lat.trim());
  const longitude = Number(lon.trim());
  if (
    lat.trim() === "" ||
    lon.trim() === "" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return failure("Coordinates must be finite values within valid ranges.");
  }

  return {
    ok: true,
    endpoint: type,
    params: {
      lat: Math.round(latitude * 100) / 100,
      lon: Math.round(longitude * 100) / 100,
    },
  };
}
