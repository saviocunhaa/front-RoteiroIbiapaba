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
        <button
          @click="handleRoteiro"
          class="bg-black text-white rounded-full px-6 py-2 text-sm font-semibold shadow hover:bg-gray-800 transition border-2 border-white"
        >
          Crie seu roteiro
        </button>

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
      
      <button
        @click="() => { handleRoteiro(); menuOpen = false }"
        class="bg-black text-white rounded-full px-6 py-2 text-sm font-semibold shadow hover:bg-gray-800 transition border-b pb-2"
      >
        Crie seu roteiro
      </button>

      <div v-if="username" class="flex items-center space-x-3 mt-4">
        <img
          :src="foto"
          alt="Usuário"
          class="w-8 h-8 rounded-full bg-gray-300 object-cover"
        />
        <span class="text-gray-700 font-medium">{{ username }}</span>
      </div>
      <button
        v-if="username"
        @click="logout"
        class="mt-2 bg-red-500 hover:bg-red-400 text-white py-2 rounded-full text-sm font-semibold transition"
      >
        Sair
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import getValidProfilePhoto from '../utils/getValidProfilePhoto'

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
