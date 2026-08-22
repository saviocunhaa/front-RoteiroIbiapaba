<template>
  <div
    class="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4 md:p-6 bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgForm})` }"
  >
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl mb-8 border border-gray-100">
      <h1 class="text-3xl font-bold text-blue-700 text-center mb-6">Geração de Roteiro com IA</h1>

      <div class="bg-blue-50 text-blue-900 p-4 rounded-xl mb-6 text-sm">
        <p class="font-bold mb-1">Como funciona seu roteiro personalizado?</p>
        <p class="text-xs text-blue-800 leading-relaxed">
          Nossa inteligência artificial analisa os pontos turísticos cadastrados na Ibiapaba, considerando sua preferência, presença de crianças e transporte para otimizar seus deslocamentos e horários.
        </p>
      </div>

      <form @submit.prevent="handleGenerateItinerary" class="space-y-5">
        <Input
          label="Cidade de Visita"
          v-model="cidade"
          type="text"
          required
          placeholder="Ex: Viçosa do Ceará, Tianguá ou Serra (para todas)"
        />

        <Input
          label="Dias de Viagem"
          v-model.number="dias"
          type="number"
          min="1"
          max="30"
          required
        />

        <Input
          label="Interesses / Estilo de Viagem"
          v-model="interesses"
          type="text"
          placeholder="Ex: Ecoturismo, trilhas, cachoeiras, gastronomia, história"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input
              v-model="comCriancas"
              type="checkbox"
              id="criancas"
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="criancas" class="text-sm font-medium text-gray-700 cursor-pointer">Viajando com crianças?</label>
          </div>

          <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input
              v-model="carroProprio"
              type="checkbox"
              id="carro"
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="carro" class="text-sm font-medium text-gray-700 cursor-pointer">Usará carro próprio?</label>
          </div>
        </div>

        <Select
          v-model="hospedagem"
          :options="cityList"
          label="Cidade de Hospedagem (Opcional)"
          placeholder="Selecione onde vai dormir"
        />

        <Button
          type="submit"
          full
          :disabled="loading"
        >
          <span v-if="loading">Gerando Roteiro com IA...</span>
          <span v-else>Gerar Roteiro Personalizado</span>
        </Button>

        <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm text-center rounded-lg border border-red-100">
          {{ error }}
        </div>
      </form>
    </div>

    <!-- Indicador de Carregamento -->
    <div v-if="loading" class="flex flex-col items-center justify-center my-12 bg-white p-8 rounded-2xl shadow-lg">
      <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <h3 class="text-lg font-bold text-gray-800">Montando o seu itinerário...</h3>
      <p class="text-sm text-gray-500 mt-1">Consultando atrativos locais e calculando rotas ideais.</p>
    </div>

    <!-- Exibição do Roteiro Gerado -->
    <div
      v-else-if="roteiro"
      class="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100 mb-12"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center pb-6 mb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-blue-800">Seu Roteiro na Serra da Ibiapaba</h2>
          <p class="text-sm text-gray-500">Planejamento customizado por Inteligência Artificial</p>
        </div>
        <button
          @click="downloadPDF"
          class="bg-green-600 hover:bg-green-500 text-white py-2.5 px-6 rounded-xl font-semibold shadow-md transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Baixar em PDF
        </button>
      </div>

      <div id="roteiro-content" class="space-y-6 text-gray-800">
        <p v-if="roteiro.saudacao" class="text-lg text-blue-900 font-medium bg-blue-50 p-4 rounded-xl">
          {{ roteiro.saudacao }}
        </p>

        <!-- Considerações Iniciais -->
        <div v-if="roteiro.consideracoes_iniciais" class="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🎒</span> Recomendações e Informações Práticas
          </h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li v-if="roteiro.consideracoes_iniciais.clima"><strong>Clima:</strong> {{ roteiro.consideracoes_iniciais.clima }}</li>
            <li v-if="roteiro.consideracoes_iniciais.roupas"><strong>Vestimenta:</strong> {{ roteiro.consideracoes_iniciais.roupas }}</li>
            <li v-if="roteiro.consideracoes_iniciais.transporte"><strong>Transporte:</strong> {{ roteiro.consideracoes_iniciais.transporte }}</li>
            <li v-if="roteiro.consideracoes_iniciais.alimentacao"><strong>Gastronomia:</strong> {{ roteiro.consideracoes_iniciais.alimentacao }}</li>
          </ul>
        </div>

        <!-- Dias do Roteiro -->
        <div v-if="roteiro.dias && roteiro.dias.length" class="space-y-6">
          <div
            v-for="(dia, index) in roteiro.dias"
            :key="index"
            class="border border-blue-100 rounded-2xl p-5 shadow-sm bg-white"
          >
            <div class="flex items-center gap-3 pb-3 border-b border-gray-100 mb-4">
              <span class="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">{{ dia.dia || `Dia ${index + 1}` }}</span>
              <h4 class="text-base md:text-lg font-bold text-blue-950">{{ dia.titulo }}</h4>
            </div>

            <ul class="space-y-3 pl-2">
              <li
                v-for="(atividade, idx) in dia.atividades"
                :key="idx"
                class="flex items-start gap-3 text-sm text-gray-700"
              >
                <span class="font-mono font-semibold bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">
                  {{ atividade.hora }}
                </span>
                <span>{{ atividade.descricao }}</span>
              </li>
            </ul>

            <p v-if="dia.resumo" class="mt-4 pt-3 border-t border-dashed border-gray-100 text-xs text-gray-500">
              <strong>Resumo do dia:</strong> {{ dia.resumo }}
            </p>
          </div>
        </div>

        <!-- Dicas e Alternativas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div v-if="roteiro.alternativas_mau_tempo?.length" class="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <h4 class="font-bold text-amber-900 text-sm mb-2">🌧️ Em caso de chuva / mau tempo</h4>
            <ul class="list-disc pl-5 space-y-1 text-xs text-amber-800">
              <li v-for="(item, idx) in roteiro.alternativas_mau_tempo" :key="idx">{{ item }}</li>
            </ul>
          </div>

          <div v-if="roteiro.dicas_adicionais?.length" class="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 class="font-bold text-emerald-900 text-sm mb-2">💡 Dicas Locais</h4>
            <ul class="list-disc pl-5 space-y-1 text-xs text-emerald-800">
              <li v-for="(item, idx) in roteiro.dicas_adicionais" :key="idx">{{ item }}</li>
            </ul>
          </div>
        </div>

        <p v-if="roteiro.mensagem_final" class="text-center font-semibold text-blue-700 pt-4">
          {{ roteiro.mensagem_final }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import itineraryService from '../services/itineraryService'
import html2pdf from 'html2pdf.js'
import bgForm from '../assets/fundo-formulario.png'
import Input from '../components/UI/Input.vue'
import Select from '../components/UI/Select.vue'
import Button from '../components/UI/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const cidade = ref('')
const dias = ref(2)
const interesses = ref('')
const comCriancas = ref(false)
const carroProprio = ref(true)
const hospedagem = ref('')
const error = ref('')
const roteiro = ref(null)
const loading = ref(false)

const cityList = [
  'Carnaubal',
  'Croatá',
  'Guaraciaba do Norte',
  'Ibiapina',
  'Ipu',
  'São Benedito',
  'Tianguá',
  'Ubajara',
  'Viçosa do Ceará',
  'Serra',
]

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})

const handleGenerateItinerary = async () => {
  loading.value = true
  error.value = ''
  roteiro.value = null

  try {
    const data = await itineraryService.generateItinerary({
      cidade: cidade.value,
      dias: dias.value,
      interesses: interesses.value,
      comCriancas: comCriancas.value,
      carroProprio: carroProprio.value,
      hospedagem: hospedagem.value,
    })
    roteiro.value = data
  } catch (err) {
    console.error('Erro na geração do roteiro:', err)
    if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      router.push('/login')
    } else {
      error.value = err.message || 'Erro ao gerar roteiro. Tente novamente mais tarde.'
    }
  } finally {
    loading.value = false
  }
}

const downloadPDF = () => {
  const element = document.getElementById('roteiro-content')
  if (!element) return

  html2pdf()
    .from(element)
    .set({
      margin: 12,
      filename: `Roteiro_Ibiapaba_${cidade.value || 'Geral'}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .save()
}
</script>
