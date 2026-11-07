import React from 'react';
import WeatherIcon from "./WeatherIcon";
import { formatWeatherDescription } from "../utils/weather";

export default function Forecast({ forecastData, error: forecastError }) {
  if ((!forecastData || !forecastData.list) && !forecastError) return null;

  const timezone = forecastData?.city?.timezone ?? 0;
  const dailyGroups = new Map();
  for (const item of forecastData?.list ?? []) {
    const localDateTime = new Date((item.dt + timezone) * 1000);
    const date = localDateTime.toISOString().slice(0, 10);
    const localMinutes =
      localDateTime.getUTCHours() * 60 + localDateTime.getUTCMinutes();
    const group = dailyGroups.get(date) ?? {
      date,
      min: Infinity,
      max: -Infinity,
      middayDistance: Infinity,
      representative: item,
    };
    const temperatureMin = item.main.temp_min ?? item.main.temp;
    const temperatureMax = item.main.temp_max ?? item.main.temp;
    const middayDistance = Math.abs(localMinutes - 12 * 60);

    group.min = Math.min(group.min, temperatureMin);
    group.max = Math.max(group.max, temperatureMax);
    if (middayDistance < group.middayDistance) {
      group.middayDistance = middayDistance;
      group.representative = item;
    }
    dailyGroups.set(date, group);
  }
  const dailyForecasts = [...dailyGroups.values()].slice(0, 5);

  return (
    <div className="mt-8 w-full max-w-4xl">
      <h3 className="text-xl font-bold text-white mb-4 drop-shadow">5-Day Forecast</h3>
      {forecastError ? (
        <p className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/80">
          Forecast is unavailable: {forecastError}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {dailyForecasts.map((day) => {
            const item = day.representative;
            const dateLabel = new Date(
              `${day.date}T00:00:00Z`
            ).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: 'UTC',
            });
            const condition = item.weather?.[0];

            return (
              <div
                key={day.date}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-between text-white hover:bg-white/20 transition-all duration-300"
              >
                <p className="text-sm font-medium opacity-80">{dateLabel}</p>
                <WeatherIcon
                  conditionId={condition?.id}
                  description={condition?.description}
                  size={48}
                  className="my-1"
                  variant="onGlass"
                />
                <p className="text-lg font-bold">
                  {Math.round(day.min)}° / {Math.round(day.max)}°C
                </p>
                <p className="text-xs capitalize text-center opacity-75">
                  {formatWeatherDescription(condition?.description)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}