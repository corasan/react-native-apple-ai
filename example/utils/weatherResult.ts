export function weatherResult(data?: any) {
  const units = 'imperial'
  if (!data) {
    return {
      temperature: 0,
      humidity: 0,
      precipitation: 0,
      units,
    }
  }
  return {
    temperature: data.temp,
    humidity: data.humidity,
    precipitation: data.weather?.[0]?.description || 'Unknown',
    units,
  }
}
