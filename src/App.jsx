import { useState } from "react";
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
import useWeather from "./hooks/useWeather";
import "./App.css";

export default function App() {
  const {
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
  } = useWeather();
  const [selectedPlaceLabel, setSelectedPlaceLabel] = useState("");

  const isNight = isNightTime(weatherData);

  return (
    <div className={`app${isNight ? " app--night" : ""}`}>
      <div className="container">
        <header className="app__header">
          <h1>Atmosphere.io</h1>
          <p>Real-time weather powered by OpenWeatherMap</p>
        </header>

        <SearchBar
          onSearch={(city) => {
            setSelectedPlaceLabel("");
            searchCity(city);
          }}
          onSelectPlace={(place) => {
            const label = [place.name, place.region].filter(Boolean).join(", ");
            setSelectedPlaceLabel(label);
            searchCoords(place.lat, place.lon);
          }}
          onUseLocation={() => {
            setSelectedPlaceLabel("");
            searchLocation();
          }}
          loading={loading}
        />

        {error && (
          <ErrorMessage
            message={error}
            onRetry={
              ["NETWORK", "SERVER", "RATE_LIMITED"].includes(errorCode)
                ? retry
                : undefined
            }
          />
        )}

        {loading && !weatherData && <Loader />}

        <RainEffect condition={weatherData?.weather?.[0]?.main} />
        <SunEffect condition={weatherData?.weather?.[0]?.main} isNight={isNight} />
        <MoonEffect condition={weatherData?.weather?.[0]?.main} isNight={isNight} />

        {(weatherData || forecast) && (
          <TrainTransition activeKey={weatherData?.name || "default"}>
            <StormScatter isWindy={weatherData?.wind?.speed > 10}>
              {weatherData && (
                <WeatherCard
                  data={weatherData}
                  isNight={isNight}
                  cityLabel={selectedPlaceLabel}
                />
              )}
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
