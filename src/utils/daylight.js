export function isNightTime(data) {
  const { dt, sys, weather } = data ?? {};
  const icon = weather?.[0]?.icon;

  if (typeof icon === "string" && icon.length > 0) {
    return icon.endsWith("n");
  }

  const sunrise = sys?.sunrise;
  const sunset = sys?.sunset;

  if (
    Number.isFinite(dt) &&
    Number.isFinite(sunrise) &&
    Number.isFinite(sunset)
  ) {
    return dt < sunrise || dt > sunset;
  }

  return false;
}
