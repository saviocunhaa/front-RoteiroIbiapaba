<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Card do Perfil -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            :src="authStore.userPhoto"
            alt="Foto de Perfil"
            class="w-24 h-24 rounded-full bg-gray-200 object-cover border-2 border-blue-500 shadow-sm"
          />

          <div class="text-center sm:text-left flex-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ authStore.userName }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ authStore.user.email || 'Usuário autenticado' }}</p>
            <span class="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
              Turista Explorador da Ibiapaba
            </span>
          </div>

          <div class="flex gap-2">
            <Button
              @click="handleLogout"
              color="danger"
              rounded
              class="text-sm px-4"
            >
              Sair da conta
            </Button>
          </div>
        </div>
      </div>

      <!-- Seção de Favoritos -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>❤️</span> Meus Lugares Favoritos ({{ favorites.length }})
        </h2>

        <div v-if="loadingFavorites" class="text-center py-10 text-gray-400">
          Carregando seus favoritos...
        </div>

        <div v-else-if="favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="fav in favorites"
            :key="fav.id"
            class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 group hover:shadow-md transition relative"
          >
            <router-link :to="`/pontos/${fav.ponto_turistico_detalhes?.id || fav.ponto_turistico}`">
              <img
                :src="fav.ponto_turistico_detalhes?.imagens?.[0]?.imagem || 'https://placehold.co/600x300?text=Sem+Imagem'"
                class="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                :alt="fav.ponto_turistico_detalhes?.nome || 'Ponto Turístico'"
              />
              <div class="p-4">
                <h3 class="font-bold text-blue-900 text-sm truncate">
                  {{ fav.ponto_turistico_detalhes?.nome || 'Ponto Turístico' }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  {{ fav.ponto_turistico_detalhes?.cidade || 'Ibiapaba' }}
                </p>
              </div>
            </router-link>

            <button
              @click="removeFavorite(fav.id)"
              class="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow text-red-500 hover:bg-white transition"
              title="Remover dos favoritos"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-400">
          <p class="mb-4">Você ainda não adicionou nenhum ponto aos favoritos.</p>
          <router-link
            to="/explorar"
            class="inline-block bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-500 transition"
          >
            Explorar Destinos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import favoritesService from '../services/favoritesService'
import Button from '../components/UI/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const favorites = ref([])
const loadingFavorites = ref(false)

const loadFavorites = async () => {
  if (!authStore.isAuthenticated) return
  loadingFavorites.value = true
  try {
    const list = await favoritesService.getFavorites()
    favorites.value = list
  } catch (err) {
    console.error('Erro ao carregar favoritos:', err)
  } finally {
    loadingFavorites.value = false
  }
}

const removeFavorite = async (favId) => {
  try {
    await favoritesService.removeFavorite(favId)
    favorites.value = favorites.value.filter((f) => f.id !== favId)
  } catch (err) {
    console.error('Erro ao remover favorito:', err)
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
  await loadFavorites()
})
</script>