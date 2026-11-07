import { parseWeatherQuery } from "../lib/validate.mjs";

export const config = { path: "/api/weather" };

async function geocodeCity(q, signal) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  return fetch(url, { signal });
}

function errorResponse(status, code, message, headers = {}) {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );
}

export default async (req) => {
  if (req.method !== "GET") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET requests are allowed.", {
      Allow: "GET",
    });
  }

  const parsed = parseWeatherQuery(new URL(req.url).searchParams);
  if (!parsed.ok) {
    return errorResponse(400, "INVALID_QUERY", parsed.message);
  }

  if (parsed.endpoint === "geocode") {
    let upstream;
    try {
      upstream = await geocodeCity(parsed.params.q, AbortSignal.timeout(8000));
    } catch {
      return errorResponse(504, "UPSTREAM_TIMEOUT", "The location service did not respond in time.");
    }

    if (!upstream.ok) {
      if (upstream.status === 404) {
        return errorResponse(404, "NOT_FOUND", "Location data was not found.");
      }
      if (upstream.status === 401) {
        console.error("Open-Meteo rejected the geocoding request");
        return errorResponse(502, "UPSTREAM_AUTH", "The location service is unavailable.");
      }
      if (upstream.status === 429) {
        return errorResponse(429, "RATE_LIMITED", "The location service is busy. Try again later.");
      }
      return errorResponse(502, "UPSTREAM_ERROR", "The location service is unavailable.");
    }

    let data;
    try {
      data = await upstream.json();
    } catch {
      return errorResponse(502, "UPSTREAM_ERROR", "The location service returned an invalid response.");
    }

    const places = (Array.isArray(data?.results) ? data.results : []).map((place) => ({
      id: place.id,
      name: place.name,
      region: place.admin1 ?? "",
      country: place.country ?? "",
      countryCode: place.country_code ?? "",
      lat: Math.round(place.latitude * 100) / 100,
      lon: Math.round(place.longitude * 100) / 100,
    }));

    return Response.json(places, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
        "Netlify-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("OPENWEATHER_API_KEY is not configured.");
    return errorResponse(500, "INTERNAL_ERROR", "The weather service is unavailable.");
  }

  const upstreamUrl = new URL(`https://api.openweathermap.org/data/2.5/${parsed.endpoint}`);
  for (const [key, value] of Object.entries(parsed.params)) {
    upstreamUrl.searchParams.set(key, String(value));
  }
  upstreamUrl.searchParams.set("units", "metric");
  upstreamUrl.searchParams.set("appid", apiKey);

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, { signal: AbortSignal.timeout(8000) });
  } catch {
    return errorResponse(504, "UPSTREAM_TIMEOUT", "The weather service did not respond in time.");
  }

  if (!upstream.ok) {
    if (upstream.status === 404) {
      return errorResponse(404, "NOT_FOUND", "Weather data was not found.");
    }
    if (upstream.status === 401) {
      console.error("OpenWeatherMap rejected the API key");
      return errorResponse(502, "UPSTREAM_AUTH", "The weather service is unavailable.");
    }
    if (upstream.status === 429) {
      return errorResponse(429, "RATE_LIMITED", "The weather service is busy. Try again later.");
    }
    return errorResponse(502, "UPSTREAM_ERROR", "The weather service is unavailable.");
  }

  let data;
  try {
    data = await upstream.json();
  } catch {
    return errorResponse(502, "UPSTREAM_ERROR", "The weather service returned an invalid response.");
  }

  return Response.json(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
      "Netlify-CDN-Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
    },
  });
};

// TODO: add a modest per-IP rate limit.
