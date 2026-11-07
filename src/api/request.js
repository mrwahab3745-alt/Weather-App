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

export async function requestJson(url, { signal } = {}) {
  let response;
  try {
    response = await fetch(url, { signal });
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
  if (response.status >= 500 || !response.ok) {
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
