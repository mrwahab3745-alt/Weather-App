import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import Forecast from './components/Forecast';
import TrainTransition from "./components/TrainTransition";
import StormScatter from "./components/StormScatter";
import RainEffect from './components/RainEffect';
import SunEffect from './components/SunEffect';
import MoonEffect from './components/MoonEffect';
import { isNightTime } from "./utils/daylight";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
} from "./api/weather";
import "./App.css";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState(null);

  const loadWeatherAndForecast = async (weatherRequest, forecastRequest) => {
    setLoading(true);
    setError(null);
    setForecastError(null);
    try {
      const [weatherResult, forecastResult] = await Promise.all([
        weatherRequest,
        forecastRequest
          .then((data) => ({ data }))
          .catch((forecastFailure) => ({ error: forecastFailure })),
      ]);
      setWeatherData(weatherResult);
      setForecast(forecastResult.data ?? null);
      setForecastError(
        forecastResult.error?.message ??
          (forecastResult.error ? "Unable to load forecast data." : null)
      );
    } catch (err) {
      setError(err?.message || String(err) || "Failed to fetch weather");
      setWeatherData(null);
      setForecast(null);
      setForecastError(null);
    } finally {
      setLoading(false);
    }
  };

  const loadByCity = (city) =>
    loadWeatherAndForecast(
      fetchWeatherByCity(city),
      fetchForecastByCity(city)
    );

  const loadByCoords = async (lat, lon) => {
    return loadWeatherAndForecast(
      fetchWeatherByCoords(lat, lon),
      fetchForecastByCoords(lat, lon)
    );
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setLoading(false);
        setError(`Could not get your location: ${err.message}`);
      }
    );
  };

  // Default city on first load
  useEffect(() => {
    loadByCity("Lahore");
  }, []);

  const isNight = isNightTime(weatherData);

  return (
    <div className={`app${isNight ? " app--night" : ""}`}>
      <div className="container">
        <header className="app__header">
          <h1>Atmosphere.io</h1>
          <p>Real-time weather powered by OpenWeatherMap</p>
        </header>

        <SearchBar
          onSearch={loadByCity}
          onUseLocation={handleUseLocation}
          loading={loading}
        />

        {error && <ErrorMessage message={error} />}

        {loading && !weatherData && <Loader />}

        <RainEffect condition={weatherData?.weather?.[0]?.main} />
        <SunEffect condition={weatherData?.weather?.[0]?.main} isNight={isNight} />
        <MoonEffect condition={weatherData?.weather?.[0]?.main} isNight={isNight} />

        {(weatherData || forecast) && (
          <TrainTransition activeKey={weatherData?.name || "default"}>
            <StormScatter isWindy={weatherData?.wind?.speed > 10}>
              {weatherData && <WeatherCard data={weatherData} />}
              <Forecast forecastData={forecast} error={forecastError} />
            </StormScatter>
          </TrainTransition>
        )}

        <footer className="app__footer">
        </footer>
      </div>
    </div>
  );
}
