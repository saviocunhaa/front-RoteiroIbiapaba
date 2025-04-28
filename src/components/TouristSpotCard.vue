<template>
    <router-link :to="`/ponto/${spot.id}`" class="block">
      <div class="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl bg-white transition transform hover:scale-[1.02]">
        <img
          :src="spot.imagens && spot.imagens.length > 0 ? spot.imagens[0].imagem : 'https://placehold.co/400x200?text=Sem+Imagem'"
          alt="Imagem do ponto turístico"
          class="h-48 w-full object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">{{ spot.nome }}</h3>
          <p class="text-sm text-gray-600 line-clamp-3">{{ spot.descricao }}</p>
        </div>
      </div>
    </router-link>
  </template>
  
  <script setup>
  defineProps({ spot: Object })
  </script>
  