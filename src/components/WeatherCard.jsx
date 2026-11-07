import WeatherIcon from "./WeatherIcon";
import { formatWeatherDescription } from "../utils/weather";
import { formatClockTime, formatLocalDateTime } from "../utils/time";

export default function WeatherCard({ data, isNight, cityLabel }) {
  if (!data) return null;

  const {
    name,
    sys: { country, sunrise, sunset } = {},
    main: { temp, feels_like, humidity, pressure } = {},
    weather,
    wind: { speed } = {},
    clouds: { all: cloudiness } = {},
    visibility,
    dt,
    timezone,
  } = data;

  const condition = weather?.[0];

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <div>
          <h2 className="weather-card__city">
            {cityLabel || name}
            {!cityLabel && country ? (
              <span className="weather-card__country">, {country}</span>
            ) : null}
          </h2>
          <p className="weather-card__time">
            Local time: {formatLocalDateTime(dt, timezone)}
          </p>
        </div>
        {condition && (
          <WeatherIcon
            conditionId={condition.id}
            description={condition.description}
            isNight={isNight}
            size={96}
            className="weather-card__icon"
          />
        )}
      </div>

      <div className="weather-card__main">
        <div className="weather-card__temp">{Math.round(temp)}°C</div>
        <div className="weather-card__condition">
          <p className="weather-card__description">
            {formatWeatherDescription(condition?.description)}
          </p>
          <p className="weather-card__feels">
            Feels like {Math.round(feels_like)}°C
          </p>
        </div>
      </div>

      <div className="weather-card__details">
        <div className="detail">
          <span className="detail__label">Humidity</span>
          <span className="detail__value">{humidity}%</span>
        </div>
        <div className="detail">
          <span className="detail__label">Wind</span>
          <span className="detail__value">{speed} m/s</span>
        </div>
        <div className="detail">
          <span className="detail__label">Pressure</span>
          <span className="detail__value">{pressure} hPa</span>
        </div>
        <div className="detail">
          <span className="detail__label">Clouds</span>
          <span className="detail__value">{cloudiness}%</span>
        </div>
        <div className="detail">
          <span className="detail__label">Visibility</span>
          <span className="detail__value">
            {visibility ? `${(visibility / 1000).toFixed(1)} km` : "N/A"}
          </span>
        </div>
        <div className="detail">
          <span className="detail__label">Sunrise</span>
          <span className="detail__value">
            {formatClockTime(sunrise, timezone)}
          </span>
        </div>
        <div className="detail">
          <span className="detail__label">Sunset</span>
          <span className="detail__value">
            {formatClockTime(sunset, timezone)}
          </span>
        </div>
      </div>
    </div>
  );
}
