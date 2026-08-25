<template>
  <router-link 
    :to="`/pontos/${spot.id}`" 
    class="block group h-full"
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500, type: 'spring', stiffness: 100 } }"
  >
    <div class="rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover bg-white transition-all duration-300 transform group-hover:-translate-y-1.5 border border-gray-100 flex flex-col h-full relative">
      <!-- Imagem Principal com Tags Flutuantes -->
      <div class="relative overflow-hidden h-52 bg-gray-100">
        <img
          :src="cardImageUrl"
          :alt="spot.nome"
          class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        <!-- Gradiente Sutil sobre a Imagem -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

        <!-- Tag de Cidade -->
        <div v-if="spot.cidade" class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <span>📍</span>
          <span>{{ spot.cidade }}</span>
        </div>

        <!-- Tag de Categoria -->
        <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-sm">
          {{ spot.categoria_display || spot.categoria || 'Atrativo' }}
        </div>

        <!-- Botão de Favorito Flutuante -->
        <button
          type="button"
          @click.prevent.stop="handleToggleFavorite"
          class="absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90 hover:scale-110 shadow-md z-10"
          :class="isFav ? 'bg-red-500 text-white shadow-red-500/40 shadow-lg' : 'bg-black/35 text-white hover:bg-black/55'"
          :title="isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'"
        >
          <svg class="w-4 h-4" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <!-- Conteúdo do Card -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-blue-950 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {{ spot.nome }}
          </h3>
          <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed font-normal">
            {{ spot.descricao }}
          </p>
        </div>

        <!-- Rodapé do Card -->
        <div class="mt-4 pt-3.5 border-t border-gray-100 flex justify-between items-center text-xs">
          <!-- Avaliação -->
          <div class="flex items-center gap-1.5 font-bold">
            <span class="text-amber-500 text-sm">★</span>
            <span class="text-gray-900">{{ spot.media_avaliacoes > 0 ? spot.media_avaliacoes.toFixed(1) : 'Novo' }}</span>
            <span v-if="spot.total_avaliacoes > 0" class="text-[11px] text-gray-400 font-medium">({{ spot.total_avaliacoes }} avaliações)</span>
          </div>

          <!-- Link Ação -->
          <span class="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Conhecer</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { getImageUrl } from '../utils/imageHelper'

const props = defineProps({
  spot: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const isFav = computed(() => {
  return favoritesStore.isFavorited(props.spot.id)
})

const cardImageUrl = computed(() => {
  const raw = props.spot.imagens && props.spot.imagens.length > 0 ? props.spot.imagens[0].imagem : null
  return getImageUrl(raw)
})

const handleToggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  await favoritesStore.toggleFavorite(props.spot.id)
}
</script>