import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchForecastByCity,
  fetchForecastByCoords,
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from "../api/weather";

function getErrorMessage(error) {
  return error?.message || String(error) || "Failed to fetch weather";
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function getLocationErrorMessage(error) {
  switch (error.code) {
    case 1:
      return "Location permission denied. You can still search by city name.";
    case 2:
      return "Your location is unavailable. Please try again or search by city name.";
    case 3:
      return "Location request timed out. Please try again.";
    default:
      return `Could not get your location: ${error.message}`;
  }
}

export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const controllerRef = useRef(null);
  const lastRequestRef = useRef(null);

  const beginRequest = useCallback((request) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastRequestRef.current = request;
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setForecastError(null);
    return controller;
  }, []);

  const loadRequests = useCallback(
    async (controller, weatherRequest, forecastRequest) => {
      try {
        const [weatherResult, forecastResult] = await Promise.all([
          weatherRequest,
          forecastRequest
            .then((data) => ({ data }))
            .catch((forecastFailure) => ({ error: forecastFailure })),
        ]);
        if (controllerRef.current !== controller) return;

        setWeatherData(weatherResult);
        setForecast(forecastResult.data ?? null);
        setForecastError(
          forecastResult.error
            ? getErrorMessage(forecastResult.error)
            : null
        );
      } catch (requestError) {
        if (isAbortError(requestError) || controllerRef.current !== controller) {
          return;
        }
        setError(getErrorMessage(requestError));
        setErrorCode(requestError?.code ?? null);
        setWeatherData(null);
        setForecast(null);
        setForecastError(null);
      } finally {
        if (controllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    []
  );

  const searchCity = useCallback(
    (city) => {
      const request = { type: "city", value: city };
      const controller = beginRequest(request);
      return loadRequests(
        controller,
        fetchWeatherByCity(city, { signal: controller.signal }),
        fetchForecastByCity(city, { signal: controller.signal })
      );
    },
    [beginRequest, loadRequests]
  );

  const searchCoords = useCallback(
    (lat, lon) => {
      const request = { type: "coords", lat, lon };
      const controller = beginRequest(request);
      return loadRequests(
        controller,
        fetchWeatherByCoords(lat, lon, { signal: controller.signal }),
        fetchForecastByCoords(lat, lon, { signal: controller.signal })
      );
    },
    [beginRequest, loadRequests]
  );

  const searchLocation = useCallback(() => {
    const request = { type: "location" };
    const controller = beginRequest(request);

    if (!navigator.geolocation) {
      if (controllerRef.current === controller) {
        setLoading(false);
        setError("Geolocation is not supported by your browser.");
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (controllerRef.current !== controller) return;
        loadRequests(
          controller,
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude, {
            signal: controller.signal,
          }),
          fetchForecastByCoords(position.coords.latitude, position.coords.longitude, {
            signal: controller.signal,
          })
        );
      },
      (locationError) => {
        if (controllerRef.current !== controller) return;
        setLoading(false);
        setError(getLocationErrorMessage(locationError));
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [beginRequest, loadRequests]);

  const retry = useCallback(() => {
    const request = lastRequestRef.current;
    if (!request) return;
    if (request.type === "city") return searchCity(request.value);
    if (request.type === "coords") return searchCoords(request.lat, request.lon);
    return searchLocation();
  }, [searchCity, searchCoords, searchLocation]);

  useEffect(() => {
    searchCity("Lahore");
    return () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [searchCity]);

  return {
    weatherData,
    forecast,
    forecastError,
    loading,
    error,
    errorCode,
    searchCity,
    searchCoords,
    searchLocation,
    retry,
  };
}
