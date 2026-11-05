import { getWeatherIconUrl } from "../api/weather";

function formatTime(timestamp, timezoneOffset) {
  // OpenWeatherMap returns UTC seconds; adjust by location timezone offset (also seconds)
  const local = new Date((timestamp + timezoneOffset) * 1000);
  return local.toUTCString().replace(" GMT", "");
}

export default function WeatherCard({ data }) {
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
  const iconUrl = condition ? getWeatherIconUrl(condition.icon) : null;

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <div>
          <h2 className="weather-card__city">
            {name}
            {country ? <span className="weather-card__country">, {country}</span> : null}
          </h2>
          <p className="weather-card__time">
            Local time: {formatTime(dt, timezone)}
          </p>
        </div>
        {iconUrl && (
          <img
            src={iconUrl}
            alt={condition.description}
            className="weather-card__icon"
          />
        )}
      </div>

      <div className="weather-card__main">
        <div className="weather-card__temp">{Math.round(temp)}°C</div>
        <div className="weather-card__condition">
          <p className="weather-card__description">{condition?.description}</p>
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
            {new Date((sunrise + timezone) * 1000).toUTCString().split(" ")[4]}
          </span>
        </div>
        <div className="detail">
          <span className="detail__label">Sunset</span>
          <span className="detail__value">
            {new Date((sunset + timezone) * 1000).toUTCString().split(" ")[4]}
          </span>
        </div>
      </div>
    </div>
  );
}
