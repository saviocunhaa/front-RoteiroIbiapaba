<template>
  <nav class="bg-white shadow p-4 sticky top-0 z-50">
    <div class="flex justify-between items-center max-w-7xl mx-auto">
      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <img
          src="../assets/RoteiroIbiapaba.png"
          alt="Roteiro Ibiapaba Logo"
          class="h-14 md:h-16 w-auto cursor-pointer"
        />
      </router-link>

      <!-- Botão sanduíche no mobile -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
        aria-label="Abrir menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Menu desktop -->
      <div class="hidden md:flex space-x-6 items-center">
        <router-link to="/" class="text-gray-700 hover:text-blue-600 font-medium transition">Início</router-link>
        <router-link to="/explorar" class="text-gray-700 hover:text-blue-600 font-medium transition">Explorar</router-link>
        <router-link to="/contato" class="text-gray-700 hover:text-blue-600 font-medium transition">Contato</router-link>

        <Button
          @click="handleRoteiro"
          color="dark"
          rounded
          class="text-sm shadow transition border-2 border-white"
        >
          Crie seu roteiro
        </Button>

        <!-- Usuário logado -->
        <div v-if="authStore.isAuthenticated" class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition"
          >
            <img
              :src="authStore.userPhoto"
              alt="Avatar do usuário"
              class="w-9 h-9 rounded-full bg-gray-200 object-cover border border-gray-300"
            />
            <span class="text-gray-700 font-medium text-sm max-w-[120px] truncate">{{ authStore.userName }}</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1"
          >
            <router-link
              to="/perfil"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              @click="closeDropdown"
            >
              Meu Perfil
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sair da conta
            </button>
          </div>
        </div>

        <!-- Usuário visitante -->
        <div v-else class="flex items-center space-x-2">
          <router-link
            to="/login"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Entrar
          </router-link>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-3">
      <router-link
        to="/"
        class="text-gray-700 hover:text-blue-600 font-medium py-1"
        @click="menuOpen = false"
      >
        Início
      </router-link>
      <router-link
        to="/explorar"
        class="text-gray-700 hover:text-blue-600 font-medium py-1"
        @click="menuOpen = false"
      >
        Explorar
      </router-link>
      <router-link
        to="/contato"
        class="text-gray-700 hover:text-blue-600 font-medium py-1"
        @click="menuOpen = false"
      >
        Contato
      </router-link>

      <Button
        @click="() => { handleRoteiro(); menuOpen = false }"
        color="dark"
        full
        rounded
        class="text-sm my-2"
      >
        Crie seu roteiro
      </Button>

      <div v-if="authStore.isAuthenticated" class="pt-2 border-t border-gray-100 flex flex-col space-y-2">
        <router-link
          to="/perfil"
          class="flex items-center space-x-3 py-2"
          @click="menuOpen = false"
        >
          <img
            :src="authStore.userPhoto"
            alt="Avatar"
            class="w-8 h-8 rounded-full bg-gray-200 object-cover"
          />
          <span class="text-gray-800 font-medium">{{ authStore.userName }} (Meu Perfil)</span>
        </router-link>
        <Button
          @click="handleLogout"
          color="danger"
          rounded
          full
          class="text-sm"
        >
          Sair
        </Button>
      </div>

      <div v-else class="pt-2 border-t border-gray-100">
        <router-link
          to="/login"
          class="block text-center w-full py-2 bg-blue-600 text-white font-medium rounded-lg"
          @click="menuOpen = false"
        >
          Entrar / Cadastrar
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Button from './UI/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const menuOpen = ref(false)
const dropdownOpen = ref(false)

const handleRoteiro = () => {
  if (authStore.isAuthenticated) {
    router.push('/gerar-roteiro')
  } else {
    router.push('/login')
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
