<template>
  <!-- MODO COMPACTO (Para páginas de detalhes de atrativo ou barras de clima) -->
  <div
    v-if="compact"
    class="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md border border-blue-800/40 relative overflow-hidden"
  >
    <div class="absolute -right-6 -bottom-6 text-7xl opacity-20 pointer-events-none">
      {{ weather.conditionIcon }}
    </div>

    <div class="relative z-10">
      <div class="flex items-center justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ weather.conditionIcon }}</span>
          <div>
            <h4 class="font-bold text-sm leading-tight text-blue-100">Clima em {{ weather.city }}</h4>
            <span class="text-[11px] text-blue-300">{{ weather.conditionLabel }}</span>
          </div>
        </div>
        <span class="text-3xl font-extrabold text-white">{{ weather.temperature }}°C</span>
      </div>

      <div class="flex items-center gap-4 pt-3 border-t border-white/10 text-xs text-blue-200">
        <div>Sensação: <strong class="text-white">{{ weather.apparentTemp }}°C</strong></div>
        <div>Umidade: <strong class="text-white">{{ weather.humidity }}%</strong></div>
        <div>Vento: <strong class="text-white">{{ weather.windSpeed }} km/h</strong></div>
      </div>
    </div>
  </div>

  <!-- MODO COMPLETO (Para página inicial e seções em destaque) -->
  <div
    v-else
    class="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-blue-800/50 relative overflow-hidden"
  >
    <!-- Background Decorativo de Clima -->
    <div class="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Topo: Título e Seletor de Cidades da Serra -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏔️</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight text-white">
              Clima Serrano da Ibiapaba
            </h3>
            <span class="bg-blue-500/20 text-blue-300 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Ao Vivo
            </span>
          </div>
          <p class="text-xs text-blue-200 mt-1">
            Previsão e condições meteorológicas em tempo real
          </p>
        </div>

        <!-- Dropdown de Cidades -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <label for="city-select" class="text-xs text-blue-200 shrink-0">Cidade:</label>
          <select
            id="city-select"
            v-model="selectedCity"
            @change="loadWeather"
            class="bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto cursor-pointer"
          >
            <option
              v-for="c in IBIAPABA_CITIES"
              :key="c.name"
              :value="c.name"
              class="bg-gray-900 text-white"
            >
              {{ c.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Centro: Destaque da Temperatura Atual -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 items-center">
        <div class="flex items-center gap-5 md:col-span-2">
          <span class="text-6xl md:text-7xl drop-shadow-md animate-bounce-subtle">
            {{ weather.conditionIcon }}
          </span>
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                {{ weather.temperature }}°C
              </span>
              <span class="text-sm md:text-base text-blue-200 font-medium">
                {{ weather.city }}
              </span>
            </div>
            <p class="text-base text-blue-100 font-semibold mt-1">
              {{ weather.conditionLabel }}
            </p>
          </div>
        </div>

        <!-- Indicadores Rápidos -->
        <div class="grid grid-cols-3 md:grid-cols-1 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div class="flex items-center justify-between text-xs">
            <span class="text-blue-300">Sensação:</span>
            <strong class="text-white text-sm">{{ weather.apparentTemp }}°C</strong>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-blue-300">Umidade:</span>
            <strong class="text-white text-sm">{{ weather.humidity }}%</strong>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-blue-300">Vento:</span>
            <strong class="text-white text-sm">{{ weather.windSpeed }} km/h</strong>
          </div>
        </div>
      </div>

      <!-- Previsão dos Próximos 5 Dias -->
      <div class="pt-4 border-t border-white/10">
        <h4 class="text-xs uppercase font-bold text-blue-300 tracking-wider mb-3">
          Previsão para os próximos dias em {{ weather.city }}
        </h4>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            v-for="(day, index) in weather.forecast"
            :key="index"
            class="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 text-center transition group"
          >
            <span class="text-xs font-bold text-blue-200 block">{{ day.weekday }}</span>
            <span class="text-2xl my-1.5 block group-hover:scale-110 transition">{{ day.icon }}</span>
            <div class="text-xs font-bold text-white">
              {{ day.max }}° <span class="text-blue-300 font-normal text-[11px]">/ {{ day.min }}°</span>
            </div>
            <span v-if="day.rainProb > 20" class="text-[10px] text-cyan-300 block mt-1">
              💧 {{ day.rainProb }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import weatherService, { IBIAPABA_CITIES } from '../services/weatherService'

const props = defineProps({
  city: {
    type: String,
    default: 'Ubajara',
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const selectedCity = ref(props.city)
const weather = ref({
  city: props.city,
  temperature: 23,
  apparentTemp: 22,
  humidity: 75,
  windSpeed: 12,
  conditionLabel: 'Carregando...',
  conditionIcon: '🌤️',
  forecast: [],
})

const loadWeather = async () => {
  const data = await weatherService.getWeatherForCity(selectedCity.value)
  weather.value = data
}

watch(
  () => props.city,
  (newCity) => {
    if (newCity) {
      selectedCity.value = newCity
      loadWeather()
    }
  }
)

onMounted(loadWeather)
</script>

<style scoped>
@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
.animate-bounce-subtle {
  animation: bounceSubtle 4s ease-in-out infinite;
}
</style>
