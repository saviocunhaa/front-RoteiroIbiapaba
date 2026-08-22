<template>
  <div>
    <!-- HERO PRINCIPAL -->
    <section
      class="relative h-[85vh] bg-cover bg-center flex items-center justify-center text-white"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      <div class="relative z-10 text-center px-4 max-w-3xl">
        <span class="inline-block bg-white/20 backdrop-blur-md text-yellow-300 text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
          Guia Oficial de Ecoturismo & Roteiros
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
          Descubra os Encantos da Serra da Ibiapaba
        </h1>
        <p class="text-lg md:text-2xl mb-8 text-gray-100 drop-shadow">
          Natureza exuberante, clima ameno, cachoeiras e patrimônios históricos te esperam no Ceará.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/explorar"
            class="inline-block bg-yellow-400 text-gray-900 px-8 py-3.5 rounded-full font-bold text-base hover:bg-yellow-300 transition shadow-lg transform hover:scale-105"
          >
            Explorar Destinos
          </router-link>
          <router-link
            to="/gerar-roteiro"
            class="inline-block bg-blue-600/90 hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold text-base transition shadow-lg backdrop-blur-sm"
          >
            Criar Roteiro com IA
          </router-link>
        </div>
      </div>
    </section>

    <!-- SEÇÃO DE BENEFÍCIOS -->
    <section class="py-16 max-w-6xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Por que visitar a Serra da Ibiapaba?</h2>
      <p class="text-gray-500 mb-12 max-w-xl mx-auto">Uma das regiões serranas mais ricas e acolhedoras do Nordeste brasileiro</p>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <img src="../assets/natureza.png" alt="Natureza" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-800">Belezas Naturais</h3>
          <p class="text-gray-600 mt-2 text-sm">Cachoeiras, trilhas, mirantes de altitude e o Parque Nacional de Ubajara.</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <img src="../assets/cultura.png" alt="Cultura" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-800">Cultura & Tradições</h3>
          <p class="text-gray-600 mt-2 text-sm">Casarios coloniais, igrejas barrocas em Viçosa do Ceará e artesanato típico.</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <img src="../assets/gastronomia.png" alt="Gastronomia" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-800">Gastronomia Única</h3>
          <p class="text-gray-600 mt-2 text-sm">Doces tradicionais, cachaças premiadas, cafeterias de serra e pratos regionais.</p>
        </div>
      </div>
    </section>

    <!-- LISTAGEM DE DESTAQUES -->
    <section id="spots" class="py-16 bg-gray-50 px-4 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Destinos em Destaque</h2>
            <p class="text-gray-500 text-sm mt-1">Conheça alguns dos principais pontos da região</p>
          </div>
          <router-link
            to="/explorar"
            class="text-blue-600 font-semibold text-sm hover:underline hidden sm:inline-block"
          >
            Ver todos →
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-12 text-gray-400">
          Carregando destinos em destaque...
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TouristSpotCard v-for="spot in featuredSpots" :key="spot.id" :spot="spot" />
        </div>

        <div class="text-center mt-10">
          <router-link
            to="/explorar"
            class="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-base font-semibold shadow-md transition"
          >
            Explorar todos os destinos
          </router-link>
        </div>
      </div>
    </section>

    <!-- AdBanner -->
    <div class="max-w-6xl mx-auto px-4 my-8">
      <AdBanner />
    </div>

    <!-- CHAMADA PARA AÇÃO IA -->
    <section class="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <span class="bg-blue-800 text-blue-200 text-xs font-bold uppercase px-3 py-1 rounded-full mb-4 inline-block">
          Inteligência Artificial Integrada
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Crie seu roteiro personalizado em segundos</h2>
        <p class="text-blue-100 text-base md:text-lg mb-8 max-w-xl mx-auto">
          Diga quantos dias você vai passar e quais seus interesses. Nossa IA gera um cronograma diário completo.
        </p>
        <router-link
          to="/gerar-roteiro"
          class="inline-block bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 transition shadow-xl transform hover:scale-105"
        >
          Começar Agora
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import spotsService from '../services/spotsService'
import TouristSpotCard from '../components/TouristSpotCard.vue'
import bgImage from '../assets/background_serra.png'
import AdBanner from '../components/AdBanner.vue'

const featuredSpots = ref([])
const loading = ref(true)

const fetchFeatured = async () => {
  loading.value = true
  try {
    const data = await spotsService.getSpots()
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
