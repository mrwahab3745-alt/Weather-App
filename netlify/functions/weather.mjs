import { parseWeatherQuery } from "../lib/validate.mjs";

export const config = { path: "/api/weather" };

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

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("OPENWEATHER_API_KEY is not configured.");
    return errorResponse(500, "INTERNAL_ERROR", "The weather service is unavailable.");
  }

  const parsed = parseWeatherQuery(new URL(req.url).searchParams);
  if (!parsed.ok) {
    return errorResponse(400, "INVALID_QUERY", parsed.message);
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
