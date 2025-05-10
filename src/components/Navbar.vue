<template>
  <nav class="bg-white shadow p-4 sticky top-0 z-50">
    <div class="flex justify-between items-center">
      <!-- Logo -->

      

        <router-link to="/" class="flex justify-center mb-4">
          <img
            src="../assets/RoteiroIbiapaba.png"
            alt="Logo"
            class="h-20 w-auto cursor-pointer"
          />
        </router-link>



      <!-- Botão sanduíche no mobile -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden text-gray-800 focus:outline-none"
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
        <router-link to="/" class="text-gray-700 hover:text-blue-600 font-medium">Início</router-link>
        <router-link to="/explorar" class="text-gray-700 hover:text-blue-600 font-medium">Explorar</router-link>
        <Button
          @click="handleRoteiro"
          color="dark"
          rounded
          class="text-sm shadow transition border-2 border-white"
        >
          Crie seu roteiro
        </Button>

        <!-- Usuário logado -->
        <div v-if="username" class="relative">
          <button @click="toggleDropdown" class="flex items-center space-x-2">
            <img
              :src="foto"
              alt="Usuário"
              class="w-8 h-8 rounded-full bg-gray-300 object-cover"
            />
            <span class="text-gray-700 font-medium">{{ username }}</span>
          </button>

          <!-- Dropdown -->
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
            <router-link
              to="/perfil"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="closeDropdown"
            >
              Meu Perfil
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>

        <!-- Menu mobile -->
    <div v-if="menuOpen" class="md:hidden mt-4 flex flex-col space-y-2">
      <router-link to="/" class="text-gray-700 hover:text-blue-600 font-medium border-b pb-2" @click="menuOpen = false">Início</router-link>
      <router-link to="/explorar" class="text-gray-700 hover:text-blue-600 font-medium border-b pb-2" @click="menuOpen = false">Explorar</router-link>
      
      <Button
        @click="() => { handleRoteiro(); menuOpen = false }"
        color="dark"
        full
        rounded
        class="text-sm"
      >
        Crie seu roteiro
      </Button>

      <div v-if="username" class="flex items-center space-x-3 mt-4">
        <img
          :src="foto"
          alt="Usuário"
          class="w-8 h-8 rounded-full bg-gray-300 object-cover"
        />
        <span class="text-gray-700 font-medium">{{ username }}</span>
      </div>
      <Button
        v-if="username"
        @click="logout"
        color="danger"
        rounded
        full
        class="text-sm"
      >
        Sair
      </Button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import getValidProfilePhoto from '../utils/getValidProfilePhoto'
import Button from './UI/Button.vue'

const menuOpen = ref(false)
const dropdownOpen = ref(false)

const username = ref(localStorage.getItem('username') || null)
const foto = ref(getValidProfilePhoto())

const router = useRouter()

const handleRoteiro = () => {
  const token = localStorage.getItem('access')
  if (token) {
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

const logout = () => {
  localStorage.clear()
  window.location.href = '/login'
}

// 🔥 Atualiza username e foto se o storage mudar
const updateProfileInfo = () => {
  username.value = localStorage.getItem('username')
  foto.value = getValidProfilePhoto()
}

onMounted(() => {
  window.addEventListener('storage', updateProfileInfo)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateProfileInfo)
})
</script>
