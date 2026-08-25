import { apiPublic, apiPrivate } from './api'

export const reviewsService = {
  /**
   * Obtém lista de avaliações, média e total de um atrativo turístico.
   */
  async getReviews(spotId) {
    const response = await apiPublic.get(`tourist-spots/${spotId}/reviews/`)
    return response.data
  },

  /**
   * Cria ou atualiza a avaliação do usuário logado para o atrativo.
   */
  async saveReview(spotId, { nota, comentario, dica }) {
    const response = await apiPrivate.post(`tourist-spots/${spotId}/reviews/`, {
      nota: Number(nota),
      comentario: comentario?.trim(),
      dica: dica?.trim() || '',
    })
    return response.data
  },

  /**
   * Exclui a avaliação do usuário logado para o atrativo.
   */
  async deleteReview(spotId) {
    const response = await apiPrivate.delete(`tourist-spots/${spotId}/reviews/`)
    return response.data
  },
}

export default reviewsService
