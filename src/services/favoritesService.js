import { apiPrivate } from './api'

export const favoritesService = {
  /**
   * Retorna lista de pontos favoritos do usuário autenticado.
   */
  async getFavorites() {
    const response = await apiPrivate.get('favorites/')
    return response.data.results || response.data
  },

  /**
   * Adiciona um ponto turístico aos favoritos.
   */
  async addFavorite(spotId) {
    const response = await apiPrivate.post('favorites/', {
      ponto_turistico: spotId,
    })
    return response.data
  },

  /**
   * Alterna o status de favorito (adiciona ou remove com 1 clique).
   */
  async toggleFavorite(spotId) {
    const response = await apiPrivate.post('favorites/toggle/', {
      ponto_turistico: spotId,
    })
    return response.data
  },

  /**
   * Remove um favorito pelo ID do favorito ou pelo UUID do ponto turístico.
   */
  async removeFavorite(favoriteId) {
    const response = await apiPrivate.delete(`favorites/${favoriteId}/`)
    return response.data
  },
}

export default favoritesService
