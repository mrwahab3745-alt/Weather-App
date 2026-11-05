import React from 'react';
import { getWeatherIconUrl } from '../api/weather';

export default function Forecast({ forecastData }) {
  if (!forecastData || !forecastData.list) return null;

  // Har din ki 12:00 PM ki forecast pick karte hain
  const dailyForecasts = forecastData.list.filter((item) =>
    item.dt_txt.includes('12:00:00')
  );

  return (
    <div className="mt-8 w-full max-w-4xl">
      <h3 className="text-xl font-bold text-white mb-4 drop-shadow">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {dailyForecasts.map((item, index) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-between text-white hover:bg-white/20 transition-all duration-300"
            >
              <p className="text-sm font-medium opacity-80">{date}</p>
              <img
                src={getWeatherIconUrl(item.weather[0].icon)}
                alt={item.weather[0].description}
                className="w-12 h-12 my-1"
              />
              <p className="text-lg font-bold">{Math.round(item.main.temp)}°C</p>
              <p className="text-xs capitalize text-center opacity-75">
                {item.weather[0].description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}