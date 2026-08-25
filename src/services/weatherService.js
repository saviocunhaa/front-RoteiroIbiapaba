import axios from 'axios'

export const IBIAPABA_CITIES = [
  { name: 'Ubajara', lat: -3.8547, lon: -40.9239 },
  { name: 'Viçosa do Ceará', lat: -3.5658, lon: -41.0928 },
  { name: 'Tianguá', lat: -3.7319, lon: -40.9917 },
  { name: 'São Benedito', lat: -4.0475, lon: -40.8653 },
  { name: 'Guaraciaba do Norte', lat: -4.1672, lon: -40.7486 },
  { name: 'Ibiapina', lat: -3.9236, lon: -40.8953 },
  { name: 'Ipu', lat: -4.3217, lon: -40.7108 },
  { name: 'Carnaubal', lat: -4.1650, lon: -40.9422 },
  { name: 'Croatá', lat: -4.3800, lon: -40.8800 },
]

const WMO_CODES = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Principalmente limpo', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Neblina da Serra', icon: '🌫️' },
  48: { label: 'Nevoeiro espesso', icon: '🌫️' },
  51: { label: 'Garoa leve', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa densa', icon: '🌧️' },
  61: { label: 'Chuva leve', icon: '🌧️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva forte', icon: '⛈️' },
  80: { label: 'Pancadas de chuva', icon: '🌦️' },
  81: { label: 'Pancadas moderadas', icon: '🌧️' },
  82: { label: 'Pancadas violentas', icon: '⛈️' },
  95: { label: 'Trovoadas', icon: '⚡' },
}

const cache = new Map()
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutos

export const weatherService = {
  getCityCoordinates(cityName) {
    if (!cityName) return IBIAPABA_CITIES[0]
    const normalized = cityName.toLowerCase().trim()
    return (
      IBIAPABA_CITIES.find((c) => c.name.toLowerCase() === normalized) ||
      IBIAPABA_CITIES.find((c) => normalized.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(normalized)) ||
      IBIAPABA_CITIES[0]
    )
  },

  async getWeatherForCity(cityName) {
    const city = this.getCityCoordinates(cityName)
    const cacheKey = `weather_${city.name}`

    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FFortaleza&forecast_days=5`
      const response = await axios.get(url)
      const data = response.data

      const currentCode = data.current?.weather_code ?? 0
      const condition = WMO_CODES[currentCode] || { label: 'Parcialmente nublado', icon: '⛅' }

      // Mapeia os 5 dias de previsão
      const forecast = (data.daily?.time || []).map((dateStr, idx) => {
        const d = new Date(dateStr + 'T12:00:00')
        const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
        const dayCode = data.daily.weather_code?.[idx] ?? 0
        const dayCondition = WMO_CODES[dayCode] || { label: 'Limpo', icon: '☀️' }

        return {
          date: dateStr,
          weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
          max: Math.round(data.daily.temperature_2m_max?.[idx] ?? 28),
          min: Math.round(data.daily.temperature_2m_min?.[idx] ?? 19),
          rainProb: data.daily.precipitation_probability_max?.[idx] ?? 0,
          icon: dayCondition.icon,
          label: dayCondition.label,
        }
      })

      const weatherResult = {
        city: city.name,
        temperature: Math.round(data.current?.temperature_2m ?? 24),
        apparentTemp: Math.round(data.current?.apparent_temperature ?? 24),
        humidity: data.current?.relative_humidity_2m ?? 70,
        windSpeed: Math.round(data.current?.wind_speed_10m ?? 10),
        conditionLabel: condition.label,
        conditionIcon: condition.icon,
        isDay: Boolean(data.current?.is_day),
        forecast,
        updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }

      cache.set(cacheKey, { timestamp: Date.now(), data: weatherResult })
      return weatherResult
    } catch (err) {
      console.warn(`Falha ao consultar clima para ${city.name}, usando fallback serrano:`, err)
      return {
        city: city.name,
        temperature: 22,
        apparentTemp: 21,
        humidity: 78,
        windSpeed: 14,
        conditionLabel: 'Clima ameno da Serra',
        conditionIcon: '🌤️',
        isDay: true,
        forecast: [
          { weekday: 'Hoje', max: 27, min: 19, rainProb: 15, icon: '🌤️', label: 'Parcialmente nublado' },
          { weekday: 'Amanhã', max: 26, min: 18, rainProb: 20, icon: '⛅', label: 'Ameno' },
          { weekday: 'Qua', max: 27, min: 19, rainProb: 10, icon: '☀️', label: 'Céu limpo' },
          { weekday: 'Qui', max: 28, min: 20, rainProb: 30, icon: '🌦️', label: 'Pancadas isoladas' },
          { weekday: 'Sex', max: 26, min: 18, rainProb: 15, icon: '🌤️', label: 'Ameno' },
        ],
        updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
    }
  },
}

export default weatherService
