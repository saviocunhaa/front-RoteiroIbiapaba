<template>
  <!-- HERO SECTION -->
  <div>
    <section
      class="relative h-[85vh] bg-cover bg-center flex items-center justify-center text-white"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <div class="text-center px-4 bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Descubra os Encantos da Serra da Ibiapaba
        </h1>
        <p class="text-xl md:text-2xl mb-6">
          Natureza, cultura e aventura te esperam
        </p>
        <a
          href="#spots"
          class="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition"
        >
          Explorar agora
        </a>
      </div>
    </section>

    <!-- LISTAGEM DE PONTOS TURÍSTICOS -->
    <section id="spots" class="py-16 bg-white px-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Destinos Incríveis</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TouristSpotCard v-for="spot in spots" :key="spot.id" :spot="spot" />
      </div>

      <div class="text-center mt-10" v-if="nextPage">
        <button
          @click="loadMore"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg font-medium transition"
        >
          Carregar mais destinos
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiPublic } from '../services/api'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import bgImage from '../assets/background_serra.png'

const spots = ref([])
const nextPage = ref(null)

const fetchSpots = async (url = '/tourist-spots/') => {
  const response = await apiPublic.get(url)  // 👈 corrigido aqui
  const newSpots = response.data.results

  // Embaralha a lista recebida
  const shuffled = newSpots.sort(() => 0.5 - Math.random())

  spots.value.push(...shuffled)
  nextPage.value = response.data.next
}

onMounted(() => {
  fetchSpots()
})

const loadMore = () => {
  if (nextPage.value) {
    const fullUrl = new URL(nextPage.value)
    const relativeUrl = fullUrl.pathname.replace('/api', '') + fullUrl.search
    fetchSpots(relativeUrl)
  }
}
</script>
