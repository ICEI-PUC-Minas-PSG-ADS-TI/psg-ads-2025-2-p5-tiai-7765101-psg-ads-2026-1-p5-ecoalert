const HOUR_IN_MS = 60 * 60 * 1000;
const PERIOD_HOURS = {
  "6h": 6,
  "12h": 12,
  "24h": 24,
};

export function prepareWeatherDataForPeriod(data = [], period = "24h", now = new Date()) {
  if (period === "7d") {
    return aggregateWeatherDataByDay(data, now);
  }

  return filterWeatherDataByHours(data, PERIOD_HOURS[period] || PERIOD_HOURS["24h"], now);
}

export function getWeatherPeriodLabel(period = "24h") {
  if (period === "7d") return "Últimos 7 dias";

  const hours = PERIOD_HOURS[period] || PERIOD_HOURS["24h"];
  return `Últimas ${hours} horas`;
}

export function isDailyWeatherPeriod(period = "24h") {
  return period === "7d";
}

function filterWeatherDataByHours(data, hours, now) {
  const endDate = floorToHour(now);
  const startDate = new Date(endDate.getTime() - hours * HOUR_IN_MS);
  const includeDate = startDate.toDateString() !== endDate.toDateString();

  const filteredData = data
    .map((point) => enrichHourlyPoint(point, includeDate))
    .filter((point) => point.timestamp >= startDate.getTime() && point.timestamp <= endDate.getTime())
    .sort((a, b) => a.timestamp - b.timestamp);

  if (filteredData.length > 0) {
    return filteredData;
  }

  return data
    .slice(-Math.min(hours + 1, data.length))
    .map((point) => enrichHourlyPoint(point, includeDate));
}

function aggregateWeatherDataByDay(data, now) {
  const endDate = now;
  const startDate = startOfDay(now);
  startDate.setDate(startDate.getDate() - 6);

  const buckets = data
    .map((point) => {
      const date = parseWeatherPointDate(point);
      return date ? { ...point, date, timestamp: date.getTime() } : null;
    })
    .filter((point) => point && point.timestamp >= startDate.getTime() && point.timestamp <= endDate.getTime())
    .reduce((acc, point) => {
      const dateKey = formatDateKey(point.date);

      if (!acc.has(dateKey)) {
        acc.set(dateKey, {
          fullTime: dateKey,
          timestamp: startOfDay(point.date).getTime(),
          label: formatDayMonth(point.date),
          temperatureValues: [],
          precipitation: 0,
          windSpeedValues: [],
          windGustsValues: [],
        });
      }

      const bucket = acc.get(dateKey);

      if (typeof point.temperature === "number") {
        bucket.temperatureValues.push(point.temperature);
      }

      if (typeof point.precipitation === "number") {
        bucket.precipitation += point.precipitation;
      }

      if (typeof point.windSpeed === "number") {
        bucket.windSpeedValues.push(point.windSpeed);
      }

      if (typeof point.windGusts === "number") {
        bucket.windGustsValues.push(point.windGusts);
      }

      return acc;
    }, new Map());

  return Array.from(buckets.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((bucket) => ({
      fullTime: bucket.fullTime,
      timestamp: bucket.timestamp,
      label: bucket.label,
      time: bucket.label,
      temperature: average(bucket.temperatureValues),
      precipitation: bucket.precipitation,
      windSpeed: average(bucket.windSpeedValues),
      windGusts: max(bucket.windGustsValues),
    }));
}

function enrichHourlyPoint(point, includeDate) {
  const date = parseWeatherPointDate(point);

  if (!date) {
    return {
      ...point,
      timestamp: 0,
      label: point.time || "",
    };
  }

  const time = formatHourMinute(date);

  return {
    ...point,
    timestamp: date.getTime(),
    time,
    label: includeDate ? `${formatDayMonth(date)} ${time}` : time,
  };
}

function parseWeatherPointDate(point) {
  if (!point?.fullTime) return null;

  const date = new Date(point.fullTime);
  return Number.isNaN(date.getTime()) ? null : date;
}

function floorToHour(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDayMonth(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

function formatHourMinute(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function average(values) {
  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function max(values) {
  if (!values.length) return null;

  return Math.max(...values);
}
