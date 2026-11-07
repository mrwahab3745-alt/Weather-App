import { requestJson, WeatherApiError } from "./request";

const placeCache = new Map();
const MAX_CACHE_ENTRIES = 50;

function normalizeQuery(query) {
  return query.trim().replace(/\s+/gu, " ");
}

function cachePlaces(key, places) {
  if (placeCache.size >= MAX_CACHE_ENTRIES) {
    placeCache.delete(placeCache.keys().next().value);
  }
  placeCache.set(key, places);
}

export async function searchPlaces(query, { signal } = {}) {
  const normalizedQuery = normalizeQuery(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const cacheKey = normalizedQuery.toLowerCase();
  if (placeCache.has(cacheKey)) {
    return placeCache.get(cacheKey);
  }

  let places;
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    const mock = await import("./mock.js");
    places = mock.getMockPlaces(normalizedQuery);
  } else {
    const params = new URLSearchParams({
      type: "geocode",
      q: normalizedQuery,
    });
    places = await requestJson(`/api/weather?${params}`, { signal });
  }

  if (!Array.isArray(places)) {
    throw new WeatherApiError(
      "Weather service is temporarily unavailable. Please try again later.",
      "SERVER",
    );
  }

  cachePlaces(cacheKey, places);
  return places;
}
