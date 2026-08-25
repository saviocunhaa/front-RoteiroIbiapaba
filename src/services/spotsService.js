import { apiPublic, apiPrivate } from './api'

export const spotsService = {
  /**
   * Busca lista paginada e filtrada de pontos turísticos diretamente do backend Django.
   */
  async getSpots(params = {}) {
    const cleanParams = {}
    if (params.page) cleanParams.page = params.page
    if (params.page_size) cleanParams.page_size = params.page_size
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim()
    if (params.cidade && params.cidade.trim()) cleanParams.cidade = params.cidade.trim()
    if (params.categoria && params.categoria.trim()) cleanParams.categoria = params.categoria.trim()
    if (params.status && params.status.trim()) cleanParams.status = params.status.trim()
    if (params.ordering) cleanParams.ordering = params.ordering

    // Se estiver filtrando por status (ex: pendente), usa apiPrivate para carregar token de admin se houver
    const client = params.status ? apiPrivate : apiPublic
    const response = await client.get('tourist-spots/', { params: cleanParams })
    return response.data
  },

  /**
   * Obtém detalhes de um ponto turístico específico pelo UUID.
   */
  async getSpotById(id) {
    const response = await apiPublic.get(`tourist-spots/${id}/`)
    return response.data
  },

  /**
   * Obtém estatísticas reais e consolidadas de todo o banco de dados.
   */
  async getStats() {
    const response = await apiPublic.get('tourist-spots/stats/')
    return response.data
  },

  /**
   * Cria novo ponto turístico (Admin ou Usuário comum).
   */
  async createSpot(spotData) {
    const isFormData = spotData instanceof FormData
    const response = await apiPrivate.post('tourist-spots/', spotData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },

  /**
   * Sugere um novo ponto turístico pela comunidade (multipart/form-data com fotos).
   */
  async suggestSpot(formData) {
    const response = await apiPrivate.post('tourist-spots/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /**
   * Aprova um ponto turístico pendente (Apenas Admin).
   */
  async approveSpot(id) {
    const response = await apiPrivate.post(`tourist-spots/${id}/approve/`)
    return response.data
  },

  /**
   * Rejeita um ponto turístico pendente (Apenas Admin).
   */
  async rejectSpot(id, motivo = '') {
    const response = await apiPrivate.post(`tourist-spots/${id}/reject/`, {
      motivo_rejeicao: motivo,
    })
    return response.data
  },

  /**
   * Atualiza ponto turístico existente (Apenas Staff/Admin).
   */
  async updateSpot(id, spotData) {
    const isFormData = spotData instanceof FormData
    const response = await apiPrivate.put(`tourist-spots/${id}/`, spotData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },

  /**
   * Exclui ponto turístico (Apenas Staff/Admin).
   */
  async deleteSpot(id) {
    const response = await apiPrivate.delete(`tourist-spots/${id}/`)
    return response.data
  },

  /**
   * Upload / Contribuição de fotos para um ponto turístico (Admin ou Visitante).
   */
  async contributePhoto(spotId, formData) {
    const response = await apiPrivate.post(`tourist-spots/${spotId}/upload_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /**
   * Aprova uma foto enviada pela comunidade (Apenas Admin).
   */
  async approveImage(spotId, imageId) {
    const response = await apiPrivate.post(`tourist-spots/${spotId}/approve_image/`, {
      image_id: imageId,
    })
    return response.data
  },

  /**
   * Obtém lista de todas as fotos pendentes de aprovação (Apenas Admin).
   */
  async getPendingImages() {
    const response = await apiPrivate.get('tourist-spots/pending_images/')
    return response.data
  },

  /**
   * Upload de imagem para um ponto turístico (Apenas Staff/Admin).
   */
  async uploadImage(spotId, formData) {
    const response = await apiPrivate.post(`tourist-spots/${spotId}/upload_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /**
   * Deleta uma imagem de um ponto turístico (Apenas Staff/Admin).
   */
  async deleteImage(spotId, imageId) {
    const response = await apiPrivate.delete(`tourist-spots/${spotId}/delete_image/`, {
      params: { image_id: imageId },
    })
    return response.data
  },
  /**
   * Obtém todas as avaliações do sistema (Apenas Admin).
   */
  async getAllReviews() {
    const response = await apiPrivate.get('tourist-spots/all-reviews/')
    return response.data
  },

  /**
   * Exclui uma avaliação (Apenas Admin).
   */
  async deleteReview(id) {
    const response = await apiPrivate.delete(`tourist-spots/all-reviews/${id}/`)
    return response.data
  },
}

export default spotsService
