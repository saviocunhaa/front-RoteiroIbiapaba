<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
    <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-500 font-medium">Carregando detalhes do atrativo...</p>
      </div>

      <div v-else-if="spot.id">
        <!-- Imagem Principal -->
        <div class="relative mb-8 rounded-2xl overflow-hidden shadow-md">
          <img
            :src="mainImage"
            :alt="spot.nome"
            class="w-full h-[320px] md:h-[480px] object-cover"
          />
          <div class="absolute top-4 right-4 flex space-x-2">
            <button
              @click="toggleFavorite"
              class="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition"
              :title="isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'"
            >
              <svg
                class="w-6 h-6"
                :class="isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs uppercase px-3 py-1.5 rounded-lg font-semibold">
            {{ spot.categoria_display || spot.categoria || 'Turismo' }}
          </div>
        </div>

        <!-- Nome e Localização -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-blue-950">{{ spot.nome }}</h1>
            <p class="text-gray-500 flex items-center gap-1.5 mt-1 text-sm font-medium">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ spot.cidade }} - Serra da Ibiapaba, Ceará
            </p>
          </div>

          <a
            v-if="spot.latitude && spot.longitude"
            :href="`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-4 py-2 rounded-xl text-sm transition flex items-center gap-2"
          >
            <span>Ver no Google Maps</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- Descrição -->
        <div class="prose max-w-none text-gray-700 leading-relaxed mb-10">
          <p class="text-base md:text-lg whitespace-pre-line">{{ spot.descricao }}</p>
        </div>

        <!-- Galeria de Imagens com Swiper -->
        <div v-if="spot.imagens?.length > 1" class="my-10 pt-8 border-t border-gray-100">
          <h2 class="text-xl font-bold mb-4 text-gray-900">Galeria de Fotos</h2>
          <Swiper
            :modules="[Navigation, Pagination]"
            :space-between="16"
            :slides-per-view="1"
            :breakpoints="{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }"
            navigation
            pagination
            class="rounded-2xl"
          >
            <SwiperSlide
              v-for="(img, index) in spot.imagens"
              :key="index"
              class="overflow-hidden rounded-xl bg-gray-100"
            >
              <img
                :src="img.imagem"
                :alt="img.descricao || spot.nome"
                class="w-full h-56 object-cover hover:scale-105 transition duration-300"
              />
            </SwiperSlide>
          </Swiper>
        </div>

        <!-- Sugestões de Outros Atrativos -->
        <div v-if="sugestoes.length" class="mt-12 pt-8 border-t border-gray-100">
          <h2 class="text-xl font-bold mb-6 text-gray-900">Você também pode gostar:</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in sugestoes"
              :key="item.id"
              class="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer border border-gray-100 group"
              @click="goToSpot(item.id)"
            >
              <img
                :src="item.imagens?.[0]?.imagem || 'https://placehold.co/600x300?text=Sem+Imagem'"
                class="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                :alt="item.nome"
              />
              <div class="p-4">
                <h3 class="font-bold text-blue-900 truncate">{{ item.nome }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ item.cidade }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Erro ou Não Encontrado -->
      <div v-else class="text-center py-16">
        <h3 class="text-lg font-bold text-gray-800">Atrativo não encontrado</h3>
        <router-link to="/explorar" class="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Voltar para a lista de pontos turísticos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import spotsService from '../services/spotsService'
import favoritesService from '../services/favoritesService'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const spot = ref({})
const sugestoes = ref([])
const isFavorited = ref(false)
const favoriteId = ref(null)
const loading = ref(true)

const mainImage = computed(() => {
  return spot.value.imagens?.[0]?.imagem || 'https://placehold.co/800x500?text=Sem+Imagem'
})

const checkFavoriteStatus = async (spotId) => {
  if (!authStore.isAuthenticated) {
    isFavorited.value = false
    favoriteId.value = null
    return
  }

  try {
    const favorites = await favoritesService.getFavorites()
    const fav = favorites.find((f) => f.ponto_turistico === spotId || f.ponto_turistico?.id === spotId)
    if (fav) {
      isFavorited.value = true
      favoriteId.value = fav.id
    } else {
      isFavorited.value = false
      favoriteId.value = null
    }
  } catch (err) {
    console.warn('Erro ao checar favoritos:', err)
  }
}

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    if (isFavorited.value && favoriteId.value) {
      await favoritesService.removeFavorite(favoriteId.value)
      isFavorited.value = false
      favoriteId.value = null
    } else {
      const created = await favoritesService.addFavorite(spot.value.id)
      isFavorited.value = true
      favoriteId.value = created.id
    }
  } catch (err) {
    console.error('Erro ao atualizar favorito:', err)
  }
}

const fetchSpotData = async () => {
  loading.value = true
  try {
    const spotId = route.params.id
    const data = await spotsService.getSpotById(spotId)
    spot.value = data

    // Sugestões
    const allData = await spotsService.getSpots()
    const list = allData.results || allData || []
    sugestoes.value = list.filter((s) => s.id !== spotId).slice(0, 3)

    await checkFavoriteStatus(spotId)
  } catch (err) {
    console.error('Erro ao carregar detalhes do ponto:', err)
    spot.value = {}
  } finally {
    loading.value = false
  }
}

const goToSpot = (id) => {
  router.push(`/pontos/${id}`)
}

watch(() => route.params.id, fetchSpotData, { immediate: true })
</script>