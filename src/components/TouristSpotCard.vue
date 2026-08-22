<template>
  <router-link :to="`/pontos/${spot.id}`" class="block group">
    <div class="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg bg-white transition duration-300 transform group-hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      <div class="relative overflow-hidden h-48 bg-gray-100">
        <img
          :src="spot.imagens && spot.imagens.length > 0 ? spot.imagens[0].imagem : 'https://placehold.co/400x200?text=Sem+Imagem'"
          :alt="spot.nome"
          class="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <div v-if="spot.cidade" class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
          📍 {{ spot.cidade }}
        </div>
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-blue-950 mb-1 line-clamp-1 group-hover:text-blue-600 transition">{{ spot.nome }}</h3>
          <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">{{ spot.descricao }}</p>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-blue-600 font-semibold">
          <span>Ver detalhes</span>
          <span>→</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  spot: {
    type: Object,
    required: true,
  },
})
</script>