<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- CABEÇALHO DA PÁGINA COM ALTERNADOR DE VISUALIZAÇÃO -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div class="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <span>🌿</span>
            <span>Catálogo Turístico</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-blue-950">Explorar Destinos da Ibiapaba</h1>
          <p class="text-gray-500 text-xs sm:text-sm mt-1">
            Descubra as principais cachoeiras, mirantes, cavernas e patrimônios da Serra da Ibiapaba
          </p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <span class="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 text-white font-bold rounded-2xl text-xs shadow-sm flex items-center justify-center gap-1.5">
            <span>📋</span>
            <span>Grade de Atrativos</span>
          </span>
          <router-link
            to="/mapa"
            class="flex-1 md:flex-none px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <span>🗺️</span>
            <span>Ver no Mapa</span>
          </router-link>
        </div>
      </div>

      <!-- CHIPS DE CATEGORIAS RÁPIDAS -->
      <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          @click="selectCategoryFilter('')"
          class="px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 shadow-sm"
          :class="!categoria ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
        >
          Todos ({{ totalCount }})
        </button>
        <button
          v-for="cat in categorias"
          :key="cat.value"
          @click="selectCategoryFilter(cat.value)"
          class="px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 shadow-sm flex items-center gap-1.5"
          :class="categoria === cat.value ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- BARRA DE FILTROS AVANÇADA -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-8">
        <form @submit.prevent="aplicarFiltros" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Buscar por Nome / Palavra</label>
            <div class="relative">
              <input
                v-model="busca"
                type="text"
                placeholder="Ex: Cachoeira, Parque, Igreja..."
                class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm bg-gray-50/50"
              />
              <span class="absolute left-3 top-3 text-gray-400 text-xs">🔍</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Cidade da Serra</label>
            <select
              v-model="cidade"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm bg-gray-50/50 text-gray-700"
            >
              <option value="">Todas as 9 cidades</option>
              <option v-for="c in cidades" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Categoria</label>
            <select
              v-model="categoria"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm bg-gray-50/50 text-gray-700"
            >
              <option value="">Todas as categorias</option>
              <option v-for="cat in categorias" :key="cat.value" :value="cat.value">
                {{ cat.icon }} {{ cat.label }}
              </option>
            </select>
          </div>

          <div class="flex items-end space-x-2">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition shadow-md"
            >
              Filtrar
            </button>
            <button
              type="button"
              @click="limparFiltros"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-2xl text-xs transition"
              title="Limpar filtros"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      <!-- STATUS & CONTAGEM DE RESULTADOS -->
      <div class="flex justify-between items-center mb-6 px-1">
        <span class="text-xs sm:text-sm text-gray-500 font-medium">
          Mostrando <strong class="text-gray-900">{{ spots.length }}</strong> de <strong class="text-gray-900">{{ totalCount }}</strong> atrativos
        </span>
      </div>

      <!-- Estado de Carregamento -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Carregando destinos da Ibiapaba...</p>
      </div>

      <!-- Grid de Resultados -->
      <div v-else-if="spots.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TouristSpotCard v-for="spot in spots" :key="spot.id" :spot="spot" />
        </div>

        <!-- Paginação / Carregar Mais -->
        <div class="text-center mt-14 mb-8" v-if="hasNextPage">
          <button
            @click="carregarMais"
            :disabled="loadingMore"
            class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition transform active:scale-95 disabled:opacity-50"
          >
            <span v-if="loadingMore">Carregando mais...</span>
            <span v-else>Carregar Mais Destinos ({{ spots.length }} de {{ totalCount }})</span>
          </button>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div class="text-5xl mb-4">🏔️</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Nenhum ponto turístico encontrado</h3>
        <p class="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
          Não encontramos nenhum atrativo com os filtros informados. Tente buscar por outros termos ou limpar a seleção.
        </p>
        <button
          @click="limparFiltros"
          class="bg-blue-600 text-white px-7 py-3 rounded-2xl text-xs font-bold hover:bg-blue-700 transition shadow-sm"
        >
          Limpar Filtros & Ver Todos
        </button>
      </div>

      <!-- Banner de Anúncio -->
      <div class="mt-14">
        <AdBanner />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import spotsService from '../services/spotsService'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import AdBanner from '../components/AdBanner.vue'

const route = useRoute()

const busca = ref('')
const cidade = ref('')
const categoria = ref('')

const spots = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const hasNextPage = ref(false)
const loading = ref(false)
const loadingMore = ref(false)

const cidades = [
  'Carnaubal',
  'Croatá',
  'Guaraciaba do Norte',
  'Ibiapina',
  'Ipu',
  'São Benedito',
  'Tianguá',
  'Ubajara',
  'Viçosa do Ceará',
]

const categorias = [
  { value: 'natural', label: 'Atração Natural', icon: '🌿' },
  { value: 'historical', label: 'Ponto Histórico', icon: '🏛️' },
  { value: 'cultural', label: 'Cultura & Arte', icon: '🎭' },
  { value: 'adventure', label: 'Trilhas & Aventura', icon: '🧗' },
  { value: 'religious', label: 'Religioso', icon: '⛪' },
  { value: 'gastronomic', label: 'Gastronomia', icon: '☕' },
  { value: 'other', label: 'Outros', icon: '📍' },
]

const selectCategoryFilter = (catValue) => {
  categoria.value = catValue
  fetchSpots(1, false)
}

const fetchSpots = async (page = 1, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const data = await spotsService.getSpots({
      page,
      page_size: 18,
      search: busca.value,
      cidade: cidade.value,
      categoria: categoria.value,
    })

    const results = data.results || data || []
    totalCount.value = data.count || results.length
    hasNextPage.value = !!data.next

    if (append) {
      spots.value = [...spots.value, ...results]
    } else {
      spots.value = results
    }
    currentPage.value = page
  } catch (err) {
    console.error('Erro ao buscar pontos turísticos:', err)
    if (!append) {
      spots.value = []
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const aplicarFiltros = () => {
  fetchSpots(1, false)
}

const limparFiltros = () => {
  busca.value = ''
  cidade.value = ''
  categoria.value = ''
  fetchSpots(1, false)
}

const carregarMais = () => {
  if (hasNextPage.value && !loadingMore.value) {
    fetchSpots(currentPage.value + 1, true)
  }
}

const syncWithRouteQuery = () => {
  if (route.query.busca) busca.value = String(route.query.busca)
  if (route.query.cidade) cidade.value = String(route.query.cidade)
  if (route.query.categoria) categoria.value = String(route.query.categoria)
}

watch(() => route.query, () => {
  syncWithRouteQuery()
  fetchSpots(1, false)
})

onMounted(() => {
  syncWithRouteQuery()
  fetchSpots(1, false)
})
</script>
