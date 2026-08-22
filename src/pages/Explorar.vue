<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2 text-center">Explorar Pontos Turísticos</h1>
      <p class="text-gray-600 text-center mb-8">Descubra as principais atrações, cachoeiras, mirantes e patrimônios da Serra da Ibiapaba</p>

      <!-- Barra de Filtros Integrada com a API -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <form @submit.prevent="aplicarFiltros" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Buscar</label>
            <input
              v-model="busca"
              type="text"
              placeholder="Nome ou descrição..."
              class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Cidade</label>
            <select
              v-model="cidade"
              class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
            >
              <option value="">Todas as cidades</option>
              <option v-for="c in cidades" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Categoria</label>
            <select
              v-model="categoria"
              class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
            >
              <option value="">Todas as categorias</option>
              <option v-for="cat in categorias" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

          <div class="flex items-end space-x-2">
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-xl text-sm transition shadow-sm"
            >
              Filtrar
            </button>
            <button
              type="button"
              @click="limparFiltros"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-xl text-sm transition"
              title="Limpar filtros"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      <!-- Estado de Carregamento -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-500 font-medium">Carregando destinos da Ibiapaba...</p>
      </div>

      <!-- Grid de Resultados -->
      <div v-else-if="spots.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TouristSpotCard v-for="spot in spots" :key="spot.id" :spot="spot" />
        </div>

        <!-- Paginação / Carregar Mais -->
        <div class="text-center mt-12 mb-8" v-if="hasNextPage">
          <button
            @click="carregarMais"
            :disabled="loadingMore"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition transform active:scale-95 disabled:opacity-50"
          >
            <span v-if="loadingMore">Carregando mais...</span>
            <span v-else>Carregar mais destinos ({{ spots.length }} de {{ totalCount }})</span>
          </button>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div class="text-5xl mb-4">🏔️</div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">Nenhum ponto turístico encontrado</h3>
        <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
          Não encontramos resultados com os filtros informados. Tente buscar por outros termos ou limpar os filtros.
        </p>
        <button
          @click="limparFiltros"
          class="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 transition"
        >
          Ver todos os pontos
        </button>
      </div>

      <!-- Banner de Anúncio / AdBanner -->
      <div class="mt-12">
        <AdBanner />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import spotsService from '../services/spotsService'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import AdBanner from '../components/AdBanner.vue'

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
  { value: 'natural', label: 'Atração Natural' },
  { value: 'historical', label: 'Ponto Histórico' },
  { value: 'cultural', label: 'Atração Cultural' },
  { value: 'adventure', label: 'Aventura' },
  { value: 'religious', label: 'Religioso' },
  { value: 'gastronomic', label: 'Gastronômico' },
  { value: 'other', label: 'Outro' },
]

const fetchSpots = async (page = 1, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const data = await spotsService.getSpots({
      page,
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

onMounted(() => {
  fetchSpots(1, false)
})
</script>
