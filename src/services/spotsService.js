import { apiPublic, apiPrivate } from './api'

export const spotsService = {
  /**
   * Busca lista paginada e filtrada de pontos turísticos diretamente do backend Django.
   */
  async getSpots(params = {}) {
    const cleanParams = {}
    if (params.page) cleanParams.page = params.page
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim()
    if (params.cidade && params.cidade.trim()) cleanParams.cidade = params.cidade.trim()
    if (params.categoria && params.categoria.trim()) cleanParams.categoria = params.categoria.trim()
    if (params.ordering) cleanParams.ordering = params.ordering

    const response = await apiPublic.get('tourist-spots/', { params: cleanParams })
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
}

export default spotsService
