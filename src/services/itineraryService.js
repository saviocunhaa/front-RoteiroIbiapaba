import { apiPrivate } from './api'

export const itineraryService = {
  /**
   * Gera roteiro personalizado via IA (Gemini).
   */
  async generateItinerary(payload) {
    const response = await apiPrivate.post('roteiros/generate-itinerary/', {
      cidade: payload.cidade,
      dias: Number(payload.dias),
      interesses: payload.interesses?.trim() || undefined,
      com_criancas: Boolean(payload.comCriancas),
      carro_proprio: Boolean(payload.carroProprio),
      hospedagem: payload.hospedagem?.trim() || undefined,
    })

    const rawText = response.data.roteiro
    return this.parseItineraryResponse(rawText)
  },

  /**
   * Realiza parse seguro e extração de JSON da resposta da IA.
   */
  parseItineraryResponse(rawText) {
    if (typeof rawText === 'object' && rawText !== null) {
      return rawText
    }

    if (typeof rawText !== 'string') {
      throw new Error('Formato de resposta inválido retornado pela IA.')
    }

    let cleaned = rawText.trim()

    // Remove markdown code fences se presentes
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7)
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3)
    }

    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3)
    }

    cleaned = cleaned.trim()

    try {
      return JSON.parse(cleaned)
    } catch (e) {
      // Tenta localizar o primeiro '{' e o último '}' para isolar o objeto JSON
      const start = cleaned.indexOf('{')
      const end = cleaned.lastIndexOf('}')
      if (start !== -1 && end !== -1 && end > start) {
        const jsonSubstring = cleaned.substring(start, end + 1)
        return JSON.parse(jsonSubstring)
      }
      throw new Error('Não foi possível interpretar a estrutura do roteiro gerado.')
    }
  },
}

export default itineraryService
