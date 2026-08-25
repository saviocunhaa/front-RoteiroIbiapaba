<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-blue-950 flex items-center gap-2">
            <span>🎒</span> Minhas Viagens
          </h1>
          <p class="text-gray-500 mt-1 text-sm">
            Seus roteiros gerados pela IA e locais favoritos salvos.
          </p>
        </div>
        <router-link to="/" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm text-sm">
          Criar Novo Roteiro
        </router-link>
      </div>

      <!-- Abas -->
      <div class="flex gap-2 mb-6">
        <button 
          @click="tab = 'roteiros'" 
          class="px-5 py-2.5 rounded-xl font-bold text-sm transition"
          :class="tab === 'roteiros' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
        >
          Meus Roteiros
        </button>
      </div>

      <div v-if="tab === 'roteiros'">
        <div v-if="loading" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="roteiros.length > 0" class="space-y-6">
          <div 
            v-for="r in roteiros" 
            :key="r.id"
            class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div class="p-6 border-b border-gray-100 flex justify-between items-start gap-4 cursor-pointer hover:bg-gray-50" @click="toggleExpand(r.id)">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ r.titulo }}</h3>
                <div class="flex gap-2 mt-2 flex-wrap">
                  <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{{ r.cidade }}</span>
                  <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">{{ r.dias }} dias</span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-1">Criado em:</span>
                <span class="text-sm font-semibold text-gray-600">{{ new Date(r.data_criacao).toLocaleDateString('pt-BR') }}</span>
              </div>
            </div>

            <!-- Conteúdo do Roteiro Expandido -->
            <div v-if="expandedId === r.id" class="p-6 bg-gray-50/50">
              <div class="prose prose-sm prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600" v-html="formatMarkdown(r.dados_roteiro)"></div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <span class="text-5xl mb-4 block">🗺️</span>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Nenhum roteiro salvo ainda</h3>
          <p class="text-gray-500 max-w-md mx-auto mb-6">
            Você ainda não gerou ou salvou nenhum roteiro. Deixe nossa inteligência artificial planejar a viagem perfeita para você!
          </p>
          <router-link to="/" class="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Gerar Meu Primeiro Roteiro
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiPrivate } from '../services/api'
import { marked } from 'marked'

const tab = ref('roteiros')
const roteiros = ref([])
const loading = ref(true)
const expandedId = ref(null)

const fetchRoteiros = async () => {
  loading.value = true
  try {
    const response = await apiPrivate.get('roteiros-salvos/')
    roteiros.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Erro ao buscar roteiros', error)
  } finally {
    loading.value = false
  }
}

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const formatMarkdown = (text) => {
  if (!text) return ''
  return marked(text)
}

onMounted(() => {
  fetchRoteiros()
})
</script>
