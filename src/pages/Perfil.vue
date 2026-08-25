<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Card do Perfil -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex items-center gap-5">
          <img
            :src="authStore.userPhoto"
            alt="Foto de Perfil"
            class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 object-cover border-4 border-blue-50 shadow-sm"
          />

          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <h1 class="text-2xl md:text-3xl font-extrabold text-blue-950">{{ authStore.userName }}</h1>
              <span
                v-if="authStore.isAdmin"
                class="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
              >
                Admin
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ authStore.user.email || 'Usuário autenticado' }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-100">
                🧭 Viajante da Ibiapaba
              </span>
              <span class="text-xs text-gray-400 font-medium">
                {{ favoritesStore.totalFavorites }} favoritos • {{ savedItineraries.length }} roteiro(s) salvo(s)
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <router-link
            to="/gerar-roteiro"
            class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>Criar Novo Roteiro</span>
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/admin-painel"
            class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            ⚙️ Painel Admin
          </router-link>

          <Button
            @click="handleLogout"
            color="danger"
            rounded
            class="text-xs px-4 py-2.5"
          >
            Sair
          </Button>
        </div>
      </div>

      <!-- ABAS PRINCIPAIS DO PERFIL: FAVORITOS E ROTEIROS SALVOS -->
      <div class="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
        <button
          @click="activeTab = 'favorites'"
          class="px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2"
          :class="activeTab === 'favorites' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
        >
          <span>❤️</span>
          <span>Lista de Desejos ({{ favoritesStore.totalFavorites }})</span>
        </button>

        <button
          @click="activeTab = 'itineraries'"
          class="px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2"
          :class="activeTab === 'itineraries' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
        >
          <span>🗺️</span>
          <span>Meus Roteiros com IA ({{ savedItineraries.length }})</span>
        </button>
      </div>

      <!-- ABA 1: LISTA DE DESEJOS / FAVORITOS -->
      <div v-if="activeTab === 'favorites'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 class="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>❤️</span> Destinos Salvos
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">Lugares da Serra da Ibiapaba favoritados por você</p>
          </div>

          <!-- Filtro rápido de Cidade dos favoritos -->
          <div v-if="uniqueCities.length > 1" class="flex items-center gap-2">
            <label for="fav-city" class="text-xs font-bold text-gray-500 uppercase">Cidade:</label>
            <select
              id="fav-city"
              v-model="cityFilter"
              class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas ({{ favoritesStore.totalFavorites }})</option>
              <option v-for="c in uniqueCities" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <!-- Estado de Carregamento -->
        <div v-if="favoritesStore.loading" class="flex flex-col items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p class="mt-3 text-xs text-gray-400">Carregando seus destinos favoritos...</p>
        </div>

        <!-- Grid de Favoritos -->
        <div v-else-if="filteredFavorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="fav in filteredFavorites"
            :key="fav.id"
            class="bg-white rounded-2xl overflow-hidden border border-gray-200 group hover:shadow-lg transition relative flex flex-col justify-between"
          >
            <router-link :to="`/pontos/${getSpotId(fav)}`" class="block">
              <div class="relative overflow-hidden h-44 bg-gray-100">
                <img
                  :src="getImageUrl(getSpotData(fav).imagens?.[0]?.imagem, 'https://placehold.co/600x400?text=Sem+Imagem')"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  :alt="getSpotData(fav).nome || 'Ponto Turístico'"
                  loading="lazy"
                />
                <div v-if="getSpotData(fav).cidade" class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
                  📍 {{ getSpotData(fav).cidade }}
                </div>
              </div>

              <div class="p-4">
                <h3 class="font-bold text-blue-950 text-base line-clamp-1 group-hover:text-blue-600 transition">
                  {{ getSpotData(fav).nome }}
                </h3>
                <p class="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {{ getSpotData(fav).descricao }}
                </p>
              </div>
            </router-link>

            <!-- Rodapé do Card -->
            <div class="px-4 pb-4 pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
              <div class="flex items-center gap-1 font-semibold text-amber-600">
                <span>★</span>
                <span>{{ getSpotData(fav).media_avaliacoes > 0 ? getSpotData(fav).media_avaliacoes.toFixed(1) : 'Novo' }}</span>
              </div>

              <button
                @click="removeFav(fav)"
                class="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline transition"
                title="Remover dos favoritos"
              >
                <span>Remover</span>
                <span>✕</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Estado Vazio -->
        <div v-else class="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8">
          <div class="text-5xl mb-3">🏔️❤️</div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Sua lista de desejos está vazia</h3>
          <p class="text-gray-500 text-xs max-w-sm mx-auto mb-6">
            Explore os 66 atrativos da Serra da Ibiapaba e clique no ícone de coração para salvar os lugares que você quer visitar.
          </p>
          <router-link
            to="/explorar"
            class="inline-block bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            Explorar Destinos da Serra
          </router-link>
        </div>
      </div>

      <!-- ABA 2: ROTEIROS PERSONALIZADOS SALVOS COM IA -->
      <div v-if="activeTab === 'itineraries'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 flex-wrap gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>🗺️</span> Meus Roteiros Personalizados
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">Planejamentos de viagem gerados pela IA e guardados para você</p>
          </div>

          <router-link
            to="/gerar-roteiro"
            class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
          >
            <span>+</span>
            <span>Gerar Novo Roteiro</span>
          </router-link>
        </div>

        <div v-if="loadingItineraries" class="flex flex-col items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p class="mt-3 text-xs text-gray-400">Carregando seus roteiros salvos...</p>
        </div>

        <div v-else-if="savedItineraries.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in savedItineraries"
            :key="item.id"
            class="bg-gray-50 rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div class="flex justify-between items-start mb-3">
                <span class="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md">
                  📍 {{ item.cidade }}
                </span>
                <span class="text-[10px] text-gray-400 font-mono">
                  {{ formatDate(item.data_criacao) }}
                </span>
              </div>

              <h3 class="font-extrabold text-gray-900 text-base mb-1.5 line-clamp-1">
                {{ item.titulo }}
              </h3>

              <div class="text-xs text-gray-600 space-y-1 mb-4">
                <p><strong>🗓️ Duração:</strong> {{ item.dias }} {{ item.dias === 1 ? 'dia' : 'dias' }}</p>
                <p v-if="item.interesses" class="line-clamp-2">
                  <strong>🎒 Interesses:</strong> {{ item.interesses }}
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-200 flex items-center gap-2">
              <button
                @click="openItineraryModal(item)"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-sm flex items-center justify-center gap-1"
              >
                <span>👁️</span>
                <span>Ver Roteiro</span>
              </button>

              <button
                @click="deleteItinerary(item.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition text-xs font-bold"
                title="Excluir Roteiro"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8">
          <div class="text-5xl mb-3">🗺️✨</div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Nenhum roteiro salvo ainda</h3>
          <p class="text-gray-500 text-xs max-w-sm mx-auto mb-6">
            Gere um roteiro inteligente sob medida com a nossa IA e clique em "Salvar no Perfil" para guardá-lo aqui.
          </p>
          <router-link
            to="/gerar-roteiro"
            class="inline-block bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            Gerar Meu Primeiro Roteiro
          </router-link>
        </div>
      </div>
    </div>

    <!-- MODAL DE VISUALIZAÇÃO DO ROTEIRO SALVO -->
    <Teleport to="body">
      <div
        v-if="selectedItinerary"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="selectedItinerary = null"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <div>
              <span class="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                📍 {{ selectedItinerary.cidade }} • {{ selectedItinerary.dias }} {{ selectedItinerary.dias === 1 ? 'dia' : 'dias' }}
              </span>
              <h2 class="text-xl font-bold text-gray-900 mt-1">{{ selectedItinerary.titulo }}</h2>
            </div>
            <button
              @click="selectedItinerary = null"
              class="text-gray-400 hover:text-gray-600 text-xl font-bold p-2"
            >
              ✕
            </button>
          </div>

          <!-- Conteúdo do Roteiro -->
          <div class="space-y-4 text-xs text-gray-700">
            <p v-if="selectedItinerary.dados_roteiro?.saudacao" class="bg-blue-50 p-3 rounded-xl text-blue-900 font-medium">
              {{ selectedItinerary.dados_roteiro.saudacao }}
            </p>

            <div v-for="(dia, idx) in selectedItinerary.dados_roteiro?.dias" :key="idx" class="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <h4 class="font-bold text-sm text-blue-900 mb-2">
                {{ dia.dia || `Dia ${idx + 1}` }} • {{ dia.titulo }}
              </h4>
              <ul class="space-y-2 pl-2">
                <li v-for="(a, i) in dia.atividades" :key="i" class="flex gap-2">
                  <span class="font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] shrink-0">
                    {{ a.hora }}
                  </span>
                  <span>{{ a.descricao }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              @click="selectedItinerary = null"
              class="px-5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import itineraryService from '../services/itineraryService'
import { getImageUrl } from '../utils/imageHelper'
import Button from '../components/UI/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const activeTab = ref('favorites')
const cityFilter = ref('')

const savedItineraries = ref([])
const loadingItineraries = ref(false)
const selectedItinerary = ref(null)

const getSpotData = (fav) => {
  if (!fav) return {}
  if (fav.ponto_turistico_detail && typeof fav.ponto_turistico_detail === 'object') return fav.ponto_turistico_detail
  if (fav.ponto_turistico_detalhes && typeof fav.ponto_turistico_detalhes === 'object') return fav.ponto_turistico_detalhes
  if (fav.ponto_turistico && typeof fav.ponto_turistico === 'object') return fav.ponto_turistico
  return { id: fav.ponto_turistico || fav.id }
}

const getSpotId = (fav) => {
  const spot = getSpotData(fav)
  return spot.id || fav.ponto_turistico || fav.id
}

const uniqueCities = computed(() => {
  const cities = new Set()
  favoritesStore.favorites.forEach((fav) => {
    const spot = getSpotData(fav)
    if (spot.cidade) cities.add(spot.cidade)
  })
  return Array.from(cities)
})

const filteredFavorites = computed(() => {
  if (!cityFilter.value) return favoritesStore.favorites
  return favoritesStore.favorites.filter((fav) => {
    const spot = getSpotData(fav)
    return spot.cidade === cityFilter.value
  })
})

const removeFav = async (fav) => {
  const spot = getSpotData(fav)
  await favoritesStore.toggleFavorite(spot.id || fav.ponto_turistico)
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fetchSavedItineraries = async () => {
  loadingItineraries.value = true
  try {
    const data = await itineraryService.getSavedItineraries()
    savedItineraries.value = data || []
  } catch (err) {
    console.error('Erro ao buscar roteiros salvos:', err)
  } finally {
    loadingItineraries.value = false
  }
}

const openItineraryModal = (item) => {
  selectedItinerary.value = item
}

const deleteItinerary = async (id) => {
  if (!confirm('Deseja realmente excluir este roteiro salvo?')) return
  try {
    await itineraryService.deleteSavedItinerary(id)
    await fetchSavedItineraries()
  } catch (err) {
    console.error('Erro ao excluir roteiro:', err)
    alert('Erro ao excluir roteiro.')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await authStore.fetchProfile()
  await favoritesStore.loadFavorites()
  await fetchSavedItineraries()
})
</script>