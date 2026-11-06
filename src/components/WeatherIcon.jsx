import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudMoon,
  Moon,
  Sun,
} from "lucide-react";
import { formatWeatherDescription } from "../utils/weather";

export default function WeatherIcon({
  conditionId,
  description,
  isNight = false,
  size = 48,
  className = "",
}) {
  let Icon = Cloud;
  let color = "text-slate-500";

  if (conditionId >= 200 && conditionId < 300) {
    Icon = CloudLightning;
    color = "text-indigo-600";
  } else if (conditionId >= 300 && conditionId < 400) {
    Icon = CloudDrizzle;
    color = "text-sky-600";
  } else if (conditionId >= 500 && conditionId < 600) {
    Icon = CloudRain;
    color = "text-sky-600";
  } else if (conditionId >= 600 && conditionId < 700) {
    Icon = CloudSnow;
    color = "text-blue-500";
  } else if (conditionId >= 700 && conditionId < 800) {
    Icon = CloudFog;
    color = "text-slate-500";
  } else if (conditionId === 800) {
    Icon = isNight ? Moon : Sun;
    color = isNight ? "text-indigo-500" : "text-amber-500";
  } else if (conditionId === 801 || conditionId === 802) {
    Icon = isNight ? CloudMoon : CloudSun;
    color = isNight ? "text-indigo-500" : "text-amber-500";
  }

  return (
    <Icon
      role="img"
      aria-label={formatWeatherDescription(description) || "Weather"}
      size={size}
      strokeWidth={1.8}
      className={`${color} ${className}`.trim()}
    />
  );
}
