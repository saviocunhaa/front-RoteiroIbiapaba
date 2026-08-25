<template>
  <nav 
    class="sticky top-0 z-50 transition-all duration-300"
    :class="scrolled ? 'glass-nav shadow-md py-1' : 'bg-transparent py-3'"
  >
    <div class="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-3">
      <!-- Logo -->
      <router-link to="/" class="flex items-center group transition transform active:scale-95">
        <img
          src="../assets/RoteiroIbiapaba.png"
          alt="Roteiro Ibiapaba Logo"
          class="h-12 sm:h-14 w-auto drop-shadow-sm group-hover:scale-105 transition duration-300"
        />
      </router-link>

      <!-- Botão sanduíche no mobile -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-xl hover:bg-gray-100/80 transition"
        aria-label="Abrir menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!menuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Menu desktop -->
      <div class="hidden md:flex space-x-1 lg:space-x-2 items-center">
        <router-link
          to="/"
          class="px-3.5 py-2 text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
          :class="$route.path === '/' ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
        >
          <span>🏡</span>
          <span>Início</span>
        </router-link>

        <router-link
          to="/explorar"
          class="px-3.5 py-2 text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
          :class="$route.path.startsWith('/explorar') || $route.path.startsWith('/pontos') ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
        >
          <span>🌿</span>
          <span>Explorar</span>
        </router-link>

        <router-link
          to="/mapa"
          class="px-3.5 py-2 text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
          :class="$route.path.startsWith('/mapa') ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
        >
          <span>🗺️</span>
          <span>Mapa da Serra</span>
        </router-link>

        <router-link
          to="/contato"
          class="px-3.5 py-2 text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
          :class="$route.path === '/contato' ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
        >
          <span>✉️</span>
          <span>Contato</span>
        </router-link>

        <!-- Botão Sugerir Ponto (Visível para todos) -->
        <button
          @click="handleSugerirPonto"
          class="px-3.5 py-2 text-xs lg:text-sm font-bold rounded-xl transition flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-xs transform active:scale-95"
          title="Colabore cadastrando ou sugerindo um ponto turístico"
        >
          <span>💡</span>
          <span>Sugerir Ponto</span>
        </button>

        <!-- CTA Roteiro IA -->
        <button
          @click="handleRoteiro"
          class="ml-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-xs lg:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95 flex items-center gap-1.5"
        >
          <span>✨</span>
          <span>Crie seu Roteiro IA</span>
        </button>

        <!-- Usuário logado -->
        <div v-if="authStore.isAuthenticated" class="relative ml-2">
          <button
            @click="toggleDropdown"
            class="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition"
          >
            <img
              :src="authStore.userPhoto"
              alt="Avatar do usuário"
              class="w-9 h-9 rounded-full bg-gray-200 object-cover border-2 border-blue-500 shadow-sm"
            />
            <span class="text-gray-700 font-bold text-xs max-w-[100px] truncate">{{ authStore.userName }}</span>
            <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 divide-y divide-gray-100"
          >
            <div class="px-4 py-2">
              <p class="text-xs font-bold text-gray-900 truncate">{{ authStore.userName }}</p>
              <p class="text-[11px] text-gray-500 truncate">{{ authStore.user.email }}</p>
            </div>

            <div class="py-1">
              <router-link
                v-if="authStore.isAdmin"
                to="/admin-painel"
                class="block px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-bold"
                @click="closeDropdown"
              >
                ⚙️ Painel do Administrador
              </router-link>

              <router-link
                to="/sugerir-atrativo"
                class="block px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-bold flex items-center gap-1.5"
                @click="closeDropdown"
              >
                <span>💡</span>
                <span>Sugerir Novo Ponto</span>
              </router-link>

              <router-link
                to="/minhas-viagens"
                class="block px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 font-bold flex items-center gap-1.5"
                @click="closeDropdown"
              >
                <span>🎒</span>
                <span>Minhas Viagens</span>
              </router-link>

              <router-link
                to="/perfil"
                class="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-semibold flex items-center gap-1.5"
                @click="closeDropdown"
              >
                <span>❤️</span>
                <span>Meus Favoritos</span>
              </router-link>
            </div>

            <div class="py-1">
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold"
              >
                Sair da conta
              </button>
            </div>
          </div>
        </div>

        <!-- Usuário visitante -->
        <div v-else class="flex items-center space-x-2 ml-2">
          <router-link
            to="/login"
            class="text-xs font-bold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
          >
            Entrar
          </router-link>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <div
      v-if="menuOpen"
      class="md:hidden px-4 pt-3 pb-6 border-t border-gray-100 bg-white/95 backdrop-blur-md flex flex-col space-y-2.5 shadow-lg"
    >
      <router-link
        to="/"
        class="text-gray-700 hover:text-blue-600 font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 text-sm"
        @click="menuOpen = false"
      >
        🏡 Início
      </router-link>
      <router-link
        to="/explorar"
        class="text-gray-700 hover:text-blue-600 font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 text-sm"
        @click="menuOpen = false"
      >
        🌿 Explorar Destinos
      </router-link>
      <router-link
        to="/mapa"
        class="text-gray-700 hover:text-blue-600 font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 text-sm flex items-center gap-1.5"
        @click="menuOpen = false"
      >
        🗺️ Mapa da Serra
      </router-link>
      <button
        @click="() => { handleSugerirPonto(); menuOpen = false; }"
        class="text-left w-full text-emerald-700 hover:text-emerald-800 font-bold py-2.5 px-3 rounded-xl bg-emerald-50 text-sm flex items-center gap-2 border border-emerald-100"
      >
        <span>💡</span>
        <span>Cadastrar / Sugerir Ponto</span>
      </button>
      <router-link
        to="/contato"
        class="text-gray-700 hover:text-blue-600 font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 text-sm"
        @click="menuOpen = false"
      >
        ✉️ Contato & Parcerias
      </router-link>

      <router-link
        v-if="authStore.isAdmin"
        to="/admin-painel"
        class="text-purple-700 font-bold py-2 px-3 rounded-xl bg-purple-50 text-sm"
        @click="menuOpen = false"
      >
        ⚙️ Painel Admin
      </router-link>

      <button
        @click="() => { handleRoteiro(); menuOpen = false }"
        class="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold py-3 rounded-xl shadow text-sm my-1 flex items-center justify-center gap-1.5"
      >
        <span>✨</span>
        <span>Crie seu Roteiro IA</span>
      </button>

      <div v-if="authStore.isAuthenticated" class="pt-3 border-t border-gray-100 flex flex-col space-y-2">
        <router-link
          to="/minhas-viagens"
          class="flex items-center space-x-3 py-2 px-3 rounded-xl bg-gray-50 text-blue-700 font-bold text-sm"
          @click="menuOpen = false"
        >
          <span>🎒</span>
          <span>Minhas Viagens</span>
        </router-link>
        <router-link
          to="/perfil"
          class="flex items-center space-x-3 py-2 px-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-xs hover:text-blue-600"
          @click="menuOpen = false"
        >
          <span>❤️</span>
          <span>Meus Favoritos</span>
        </router-link>
        <button
          @click="handleLogout"
          class="text-left w-full py-2 px-3 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-xl"
        >
          Sair da conta
        </button>
      </div>

      <div v-else class="pt-3 border-t border-gray-100">
        <router-link
          to="/login"
          class="block text-center w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-sm"
          @click="menuOpen = false"
        >
          Entrar / Cadastrar
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const menuOpen = ref(false)
const dropdownOpen = ref(false)
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleSugerirPonto = () => {
  if (authStore.isAuthenticated) {
    router.push('/sugerir-atrativo')
  } else {
    router.push({
      name: 'Login',
      query: { redirect: '/sugerir-atrativo' },
    })
  }
}

const handleRoteiro = () => {
  if (authStore.isAuthenticated) {
    router.push('/gerar-roteiro')
  } else {
    router.push({
      name: 'Login',
      query: { redirect: '/gerar-roteiro' },
    })
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleLogout = async () => {
  closeDropdown()
  menuOpen.value = false
  await authStore.logout()
  router.push('/login')
}
</script>
