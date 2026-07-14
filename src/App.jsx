import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from "./api/weather";
import "./App.css";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadByCity = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err?.message || String(err) || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const loadByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeather(data);
    } catch (err) {
      setError(err?.message || String(err) || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="app">
      <div className="container">
        <header className="app__header">
          <h1>Atmosphere.io</h1>
          {/* <p>🎤In bheegi bheegi sarko pr mai kis ka intazaar karu😂</p> */}
          <p>Real-time weather powered by OpenWeatherMap</p>
        </header>

        <SearchBar
          onSearch={loadByCity}
          onUseLocation={handleUseLocation}
          loading={loading}
        />

        {error && <ErrorMessage message={error} />}

        {loading && !weather && <Loader />}

        {weather && <WeatherCard data={weather} />}

        <footer className="app__footer">
          {/* <p>
            Add your OpenWeatherMap API key in <code>src/api/weather.js</code> or
            set <code>VITE_OWM_API_KEY</code> in a <code>.env</code> file.
          </p> */}
        </footer>
      </div>
    </div>
  );
}
