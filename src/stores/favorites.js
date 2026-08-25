import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import favoritesService from '../services/favoritesService'
import { useAuthStore } from './auth'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref([])
  const favoritedSpotIds = ref(new Set())
  const loading = ref(false)

  const authStore = useAuthStore()

  const totalFavorites = computed(() => favorites.value.length)

  const isFavorited = (spotId) => {
    if (!spotId) return false
    return favoritedSpotIds.value.has(String(spotId))
  }

  const loadFavorites = async () => {
    if (!authStore.isAuthenticated) {
      favorites.value = []
      favoritedSpotIds.value = new Set()
      return
    }

    loading.value = true
    try {
      const data = await favoritesService.getFavorites()
      const list = Array.isArray(data) ? data : data.results || []
      favorites.value = list

      const idSet = new Set()
      list.forEach((fav) => {
        const spotId = fav.ponto_turistico || fav.ponto_turistico_detail?.id || fav.ponto_turistico_detalhes?.id
        if (spotId) idSet.add(String(spotId))
      })
      favoritedSpotIds.value = idSet
    } catch (err) {
      console.error('Erro ao carregar favoritos na store:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (spot) => {
    if (!authStore.isAuthenticated) {
      return { requiresAuth: true }
    }

    const spotId = typeof spot === 'object' ? spot.id : spot
    const isCurrentlyFav = isFavorited(spotId)

    // Atualização otimista
    const newSet = new Set(favoritedSpotIds.value)
    if (isCurrentlyFav) {
      newSet.delete(String(spotId))
      favorites.value = favorites.value.filter(
        (f) => String(f.ponto_turistico || f.ponto_turistico_detail?.id) !== String(spotId)
      )
    } else {
      newSet.add(String(spotId))
    }
    favoritedSpotIds.value = newSet

    try {
      const res = await favoritesService.toggleFavorite(spotId)
      await loadFavorites()
      return { success: true, favorited: res.favorited }
    } catch (err) {
      console.error('Erro ao alternar favorito:', err)
      // Reverte caso falhe
      await loadFavorites()
      return { success: false, error: err }
    }
  }

  const removeFavoriteById = async (favId) => {
    try {
      await favoritesService.removeFavorite(favId)
      await loadFavorites()
      return true
    } catch (err) {
      console.error('Erro ao remover favorito:', err)
      return false
    }
  }

  return {
    favorites,
    favoritedSpotIds,
    loading,
    totalFavorites,
    isFavorited,
    loadFavorites,
    toggleFavorite,
    removeFavoriteById,
  }
})

export default useFavoritesStore
