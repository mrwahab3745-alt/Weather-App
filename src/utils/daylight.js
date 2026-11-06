export function isNightTime(data) {
  const { dt, sys, weather } = data ?? {};
  const sunrise = sys?.sunrise;
  const sunset = sys?.sunset;

  if (
    Number.isFinite(dt) &&
    Number.isFinite(sunrise) &&
    Number.isFinite(sunset)
  ) {
    return dt < sunrise || dt > sunset;
  }

  const icon = weather?.[0]?.icon;
  return typeof icon === "string" && icon.endsWith("n");
}
