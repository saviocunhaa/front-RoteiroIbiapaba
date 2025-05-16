<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-blue-700 mb-6 text-center">Explorar Pontos Turísticos</h1>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        v-model="busca"
        type="text"
        placeholder="Buscar por nome..."
        class="p-2 border rounded w-full"
      />
      <select v-model="cidade" class="p-2 border rounded w-full">
        <option value="">Todas as cidades</option>
        <option v-for="c in cidades" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="categoria" class="p-2 border rounded w-full">
        <option value="">Todas as categorias</option>
        <option v-for="cat in categorias" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>

      <button
        @click="buscar(true)"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
      >
        Filtrar
      </button>
    </div>
      <AdBanner />
    <!-- Lista -->
    <div v-if="loading" class="text-center text-gray-500">Carregando pontos turísticos...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <TouristSpotCard v-for="spot in visibleSpots" :key="spot.id" :spot="spot" />
    </div>

    <div class="text-center mt-10" v-if="!loading && visibleSpots.length < spots.length">
      <button
        @click.prevent="loadMore"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg font-medium transition"
      >
        Carregar mais destinos
      </button>
    </div>

    <div v-if="!loading && spots.length === 0" class="text-center text-gray-500 mt-8">
      Nenhum ponto encontrado com os filtros selecionados.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiPublic } from '../services/api'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import AdBanner from '../components/AdBanner.vue'

const busca = ref('')
const cidade = ref('')
const categoria = ref('')
const spots = ref([])
const visibleSpots = ref([])
const perPage = 6
const currentIndex = ref(0)
const loading = ref(false)

const cidades = [
  'Tianguá', 'Ubajara', 'Viçosa do Ceará', 'São Benedito', 'Ibiapina',
  'Carnaubal', 'Croatá', 'Ipu', 'Guaraciaba do Norte'
]

const categorias = [
  { value: 'natural', label: 'Atração Natural' },
  { value: 'historical', label: 'Ponto Histórico' },
  { value: 'cultural', label: 'Atração Cultural' },
  { value: 'adventure', label: 'Aventura' },
  { value: 'religious', label: 'Religioso' },
  { value: 'gastronomic', label: 'Gastronômico' },
  { value: 'other', label: 'Outro' }
]

const normalizarTexto = (texto) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const buscar = async (reset = false) => {
  loading.value = true

  try {
    const response = await apiPublic.get('/tourist-spots/')
    const allSpots = response.data.results || []

    const filtrados = allSpots.filter(spot => {
      const nomeSpot = normalizarTexto(spot.nome)
      const buscaTexto = normalizarTexto(busca.value)
      const cidadeMatch = !cidade.value || spot.cidade === cidade.value
      const categoriaMatch = !categoria.value || spot.categoria === categoria.value
      const nomeMatch = nomeSpot.includes(buscaTexto)

      return cidadeMatch && categoriaMatch && nomeMatch
    })

    const embaralhado = filtrados.sort(() => 0.5 - Math.random())

    if (reset) {
      spots.value = embaralhado
      currentIndex.value = 0
      visibleSpots.value = spots.value.slice(0, perPage)
    } else {
      spots.value.push(...embaralhado)
      visibleSpots.value = spots.value.slice(0, currentIndex.value + perPage)
    }
  } catch (err) {
    console.error('Erro ao buscar pontos:', err)
    if (reset) spots.value = []
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  currentIndex.value += perPage
  visibleSpots.value = spots.value.slice(0, currentIndex.value + perPage)
}

buscar(true)
</script>
