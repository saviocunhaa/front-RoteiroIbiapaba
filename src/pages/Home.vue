<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- HERO PRINCIPAL CINEMATOGRÁFICO -->
    <section
      class="relative min-h-[85vh] bg-cover bg-center flex items-center justify-center text-white px-4 py-20"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <!-- Gradientes em Camadas -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40 backdrop-blur-[0.5px]"></div>

      <div class="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <!-- Badge de Destaque -->
        <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6 shadow-sm">
          <span>🏔️</span>
          <span>Guia Oficial de Ecoturismo & Roteiros Inteligentes</span>
        </div>

        <!-- Título Principal -->
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-lg">
          Descubra os Encantos da <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Serra da Ibiapaba</span>
        </h1>

        <p class="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 font-normal max-w-2xl leading-relaxed drop-shadow">
          Cachoeiras deslumbrantes, mirantes de altitude, clima serrano e casarios históricos no coração do Ceará.
        </p>

        <!-- Barra de Busca Rápida no Hero -->
        <div class="w-full max-w-2xl bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 mb-6">
          <div class="flex items-center gap-2 px-3 w-full sm:w-auto sm:flex-1">
            <span class="text-gray-400 text-lg">🔍</span>
            <input
              v-model="heroSearch"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Onde você quer ir? (ex: Ubajara, Cachoeira, Mirante...)"
              class="w-full bg-transparent text-gray-800 text-sm font-medium focus:outline-none placeholder-gray-400 py-2"
            />
          </div>
          <button
            @click="handleSearch"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-sm font-bold px-7 py-3 rounded-xl sm:rounded-full transition shadow-md hover:shadow-lg shrink-0 flex items-center justify-center gap-2"
          >
            <span>Buscar</span>
            <span>→</span>
          </button>
        </div>

        <!-- Tags Rápidas de Cidades -->
        <div class="flex items-center justify-center gap-2 flex-wrap text-xs text-gray-300 font-medium">
          <span class="text-gray-400">Destinos populares:</span>
          <button
            v-for="c in popularCities"
            :key="c"
            @click="goToCity(c)"
            class="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 rounded-full transition hover:text-white"
          >
            {{ c }}
          </button>
        </div>

        <!-- Estatísticas Rápidas -->
        <div class="grid grid-cols-3 gap-3 sm:gap-6 mt-12 w-full max-w-xl text-center">
          <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl">
            <span class="text-2xl sm:text-3xl font-extrabold text-amber-300 block">66+</span>
            <span class="text-[11px] sm:text-xs text-gray-300 font-medium">Destinos Mapeados</span>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl">
            <span class="text-2xl sm:text-3xl font-extrabold text-emerald-300 block">9</span>
            <span class="text-[11px] sm:text-xs text-gray-300 font-medium">Cidades Serranas</span>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl">
            <span class="text-2xl sm:text-3xl font-extrabold text-cyan-300 block">100%</span>
            <span class="text-[11px] sm:text-xs text-gray-300 font-medium">Roteiros com IA</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SEÇÃO DE CATEGORIAS VISUAIS -->
    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div 
        class="text-center max-w-2xl mx-auto mb-12"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      >
        <h2 class="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-3">Viva Experiências Inesquecíveis</h2>
        <p class="text-gray-500 text-sm sm:text-base">Escolha o estilo de viagem que mais combina com você na Serra</p>
      </div>

      <div 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
      >
        <!-- Card 1 -->
        <router-link
          to="/explorar?categoria=natural"
          class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🌿
            </div>
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition mb-2">Belezas Naturais</h3>
            <p class="text-xs text-gray-500 leading-relaxed">
              Cachoeiras com quedas cristalinas, cavernas pré-históricas e mirantes a mais de 900 metros de altitude.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span>43 atrações naturais</span>
            <span>→</span>
          </div>
        </router-link>

        <!-- Card 2 -->
        <router-link
          to="/explorar?categoria=historical"
          class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🏛️
            </div>
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition mb-2">História & Cultura</h3>
            <p class="text-xs text-gray-500 leading-relaxed">
              Casarios coloniais tombados pelo IPHAN, engenhos seculares de cachaça e tradições artesanais da serra.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-amber-600 flex items-center gap-1">
            <span>18 pontos históricos</span>
            <span>→</span>
          </div>
        </router-link>

        <!-- Card 3 -->
        <router-link
          to="/explorar?categoria=adventure"
          class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div class="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🧗
            </div>
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-red-600 transition mb-2">Trilhas & Aventura</h3>
            <p class="text-xs text-gray-500 leading-relaxed">
              Trekking na mata atlântica serrana, rapel em paredões rochosos e bondinho aéreo no Parque de Ubajara.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-red-600 flex items-center gap-1">
            <span>Ver roteiros de aventura</span>
            <span>→</span>
          </div>
        </router-link>

        <!-- Card 4 -->
        <router-link
          to="/mapa"
          class="group bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div class="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🗺️
            </div>
            <h3 class="text-xl font-bold mb-2">Mapa Interativo</h3>
            <p class="text-xs text-blue-100 leading-relaxed">
              Visualize todos os 66 destinos no mapa da serra, filtre por cidade e trace rotas pelo GPS.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-white/20 text-xs font-bold text-yellow-300 flex items-center gap-1">
            <span>Abrir Mapa da Serra</span>
            <span>→</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- WIDGET DE CLIMA EM TEMPO REAL -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <WeatherWidget />
    </section>

    <!-- LISTAGEM DE DESTAQUES -->
    <section id="spots" class="py-16 bg-white px-4 sm:px-6 border-y border-gray-100">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Explore a Região</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-blue-950 mt-1">Destinos em Destaque</h2>
            <p class="text-gray-500 text-sm mt-1">Os lugares mais procurados e bem avaliados pelos viajantes</p>
          </div>
          <router-link
            to="/explorar"
            class="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <span>Ver todos os 66 atrativos</span>
            <span>→</span>
          </router-link>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-xs text-gray-400 font-semibold">Carregando atrativos em destaque...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TouristSpotCard v-for="spot in featuredSpots" :key="spot.id" :spot="spot" />
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/explorar"
            class="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
          >
            Ver Catálogo Completo de Destinos (66)
          </router-link>
        </div>
      </div>
    </section>

    <!-- AdBanner (Comentado temporariamente para remover espaço em branco extra) -->
    <!--
    <div class="max-w-6xl mx-auto px-4 my-8">
      <AdBanner />
    </div>
    -->

    <!-- BANNER LUXO - IA ROTEIRO -->
    <section class="py-10 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 rounded-4xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
        <!-- Efeito de Fundo -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-xl z-10 text-center md:text-left">
          <span class="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full mb-4 inline-block shadow-sm">
            ✨ Inteligência Artificial Especializada
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Monte seu Roteiro Perfeito em Segundos
          </h2>
          <p class="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
            Diga quantos dias você vai passar na serra, seu estilo de viagem e preferências. Nossa IA organiza o melhor cronograma com rotas inteligentes e sugestões de paradas.
          </p>
          <div class="flex items-center gap-4 flex-wrap justify-center md:justify-start text-xs text-gray-300 font-medium">
            <span class="flex items-center gap-1">⚡ Rápido e gratuito</span>
            <span class="flex items-center gap-1">📍 9 Cidades cobertas</span>
            <span class="flex items-center gap-1">📄 Cronograma diário</span>
          </div>
        </div>

        <div class="z-10 shrink-0">
          <router-link
            to="/gerar-roteiro"
            class="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-950 font-extrabold px-9 py-4 rounded-2xl text-base shadow-xl transition transform active:scale-95 hover:scale-105"
          >
            Gerar Meu Roteiro com IA 🚀
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import spotsService from '../services/spotsService'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import WeatherWidget from '../components/WeatherWidget.vue'
import bgImage from '../assets/background_serra.png'
import AdBanner from '../components/AdBanner.vue'

const router = useRouter()
const featuredSpots = ref([])
const loading = ref(true)
const heroSearch = ref('')

const popularCities = ['Ubajara', 'Viçosa do Ceará', 'Tianguá', 'São Benedito', 'Ipu']

const handleSearch = () => {
  if (heroSearch.value.trim()) {
    router.push({ path: '/explorar', query: { busca: heroSearch.value.trim() } })
  } else {
    router.push('/explorar')
  }
}

const goToCity = (city) => {
  router.push({ path: '/explorar', query: { cidade: city } })
}

const fetchFeatured = async () => {
  loading.value = true
  try {
    const data = await spotsService.getSpots({ page_size: 6 })
    const list = data.results || data || []
    featuredSpots.value = list.slice(0, 6)
  } catch (err) {
    console.error('Erro ao carregar pontos em destaque:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeatured()
})
</script>
