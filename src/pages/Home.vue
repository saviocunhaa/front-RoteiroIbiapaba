<template>
  <div>

    <!-- HERO PRINCIPAL -->
    <section
      class="relative h-[85vh] bg-cover bg-center flex items-center justify-center text-white"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <div class="text-center px-4 bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">Descubra os Encantos da Serra da Ibiapaba</h1>
        <p class="text-xl md:text-2xl mb-6">Natureza, cultura e aventura te esperam</p>
        
        <router-link to="/explorar">
        <a
          href="#spots"
          class="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition"
        >
          Explorar agora
        </a>
        </router-link>
      </div>
    </section>

    <!-- SEÇÃO DE BENEFÍCIOS -->
    <section class="py-16 max-w-6xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-gray-800 mb-12">Por que visitar a Serra?</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <img src="../assets/natureza.png" alt="" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Belezas Naturais</h3>
          <p class="text-gray-600 mt-2">Cachoeiras, trilhas e paisagens de tirar o fôlego.</p>
        </div>
        <div>
          <img src="../assets/cultura.png" alt="" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Cultura & Tradições</h3>
          <p class="text-gray-600 mt-2">Explore a rica herança histórica e cultural da região.</p>
        </div>
        <div>
          <img src="../assets/gastronomia.png" alt="" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Gastronomia Única</h3>
          <p class="text-gray-600 mt-2">Sabores autênticos que contam histórias da serra.</p>
        </div>
      </div>
    </section>

    <!-- LISTAGEM DE PONTOS TURÍSTICOS -->
    <section id="spots" class="py-16 bg-white px-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Destinos Incríveis</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TouristSpotCard v-for="spot in visibleSpots" :key="spot.id" :spot="spot" />
      </div>

     <div class="text-center mt-10" v-if="visibleSpots.length < allSpots.length">
        <router-link
          to="/explorar"
          class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg font-medium transition"
        >
          Ver todos os destinos
        </router-link>
      </div>

    </section>

    <!-- CHAMADA PARA AÇÃO / APP -->
    <section class="py-16 bg-blue-50 px-6 text-center">
      <h2 class="text-3xl font-bold text-blue-700 mb-4">Crie seu roteiro personalizado</h2>
      <p class="text-gray-700 mb-6">Planeje sua viagem de forma simples, rápida e inteligente com ajuda da nossa IA.</p>
      <router-link
        to="/gerar-roteiro"
        class="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
      >
        Gerar Roteiro
      </router-link>
    </section>

    <!-- BLOG OU NOVIDADES -->
    <!-- <section class="py-16 bg-gray-100 px-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Últimas Dicas e Novidades</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-blue-700 mb-2">5 lugares para curtir com a família</h3>
          <p class="text-gray-600 text-sm">Selecionamos os melhores destinos para quem viaja com crianças.</p>
          <router-link to="/noticias" class="text-blue-600 mt-4 block hover:underline">Leia mais →</router-link>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-blue-700 mb-2">Trilhas imperdíveis em Ubajara</h3>
          <p class="text-gray-600 text-sm">Confira os melhores caminhos para quem curte aventura e natureza.</p>
          <router-link to="/noticias" class="text-blue-600 mt-4 block hover:underline">Leia mais →</router-link>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-blue-700 mb-2">Sabores da Ibiapaba</h3>
          <p class="text-gray-600 text-sm">Descubra os pratos e produtos que representam a cultura local.</p>
          <router-link to="/noticias" class="text-blue-600 mt-4 block hover:underline">Leia mais →</router-link>
        </div>
      </div>
    </section> -->
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { apiPublic } from '../services/api'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import bgImage from '../assets/background_serra.png'

const spots = ref([])
const nextPage = ref(null)
const allSpots = ref([])       // lista completa embaralhada
const visibleSpots = ref([])   // apenas os 6 visíveis
const perPage = 6


const fetchSpots = async (url = '/tourist-spots/') => {
  const response = await apiPublic.get(url)  // 👈 corrigido aqui
  const newSpots = response.data.results

  // Embaralha a lista recebida
  const shuffled = newSpots.sort(() => 0.5 - Math.random())

  allSpots.value = shuffled
  visibleSpots.value = allSpots.value.slice(0, perPage)

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
