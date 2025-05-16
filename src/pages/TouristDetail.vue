<template>
    <div class="p-6 max-w-5xl mx-auto">
      <!-- Imagem principal -->
      <div class="mb-6">
        <img
          :src="spot.imagens?.[0]?.imagem || 'https://placehold.co/800x400?text=Sem+Imagem'"
          alt="Imagem principal"
          class="w-full h-[400px] object-cover rounded-xl shadow"
        />
      </div>
  
      <!-- Nome e descrição -->
      <h1 class="text-4xl font-bold text-blue-800 mb-4">{{ spot.nome }}</h1>
      <p class="text-lg text-gray-700 mb-8">{{ spot.descricao }}</p>
  
      <!-- Informações adicionais -->
      <div class="mt-10 text-gray-600">
        <p><strong>Cidade:</strong> {{ spot.cidade }}</p>
        <p v-if="spot.latitude && spot.longitude">
          <strong>Localização:</strong>
          <a
            :href="`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`"
            target="_blank"
            class="text-blue-600 underline ml-1"
          >
            Ver no mapa
          </a>
        </p>
      </div>
      <!-- Carrossel com Swiper -->
      <div v-if="spot.imagens?.length > 1" class="my-10">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Mais imagens</h2>
  
        <Swiper
          :space-between="20"
          :slides-per-view="1"
          :breakpoints="{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }"
          navigation
          pagination
          class="rounded-lg"
        >
          <SwiperSlide
            v-for="(img, index) in spot.imagens.slice(1)"
            :key="index"
            class="overflow-hidden rounded-md"
          >
            <img :src="img.imagem" class="w-full h-52 object-cover" />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Sugestões de outros roteiros -->
      <div v-if="sugestoes.length" class="mt-16">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">Você também pode gostar de:</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in sugestoes"
            :key="item.id"
            class="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition cursor-pointer"
            @click="$router.push(`/turismo/${item.id}`)"
          >
            <img
              :src="item.imagens?.[0]?.imagem || 'https://placehold.co/600x300?text=Sem+Imagem'"
              class="w-full h-40 object-cover"
              alt="Imagem do ponto turístico"
            />
            <div class="p-4">
              <h3 class="text-lg font-bold text-blue-700 truncate">{{ item.nome }}</h3>
              <p class="text-sm text-gray-600">{{ item.cidade }}</p>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { apiPublic } from '../services/api'

  // Swiper imports
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'

  const route = useRoute()
  const spot = ref({})
  const sugestoes = ref([])

  // 🔁 Função que busca os dados do ponto turístico e sugestões
  const fetchSpotAndSugestoes = async () => {
    const res = await apiPublic.get(`/tourist-spots/${route.params.id}/`)
    spot.value = res.data

    const all = await apiPublic.get('/tourist-spots/')
    const outros = all.data.results.filter(s => s.id !== spot.value.id)
    sugestoes.value = outros.sort(() => 0.5 - Math.random()).slice(0, 6)
  }

  // Reage a mudanças no ID da rota
  watch(() => route.params.id, fetchSpotAndSugestoes, { immediate: true })
  </script>
  
  