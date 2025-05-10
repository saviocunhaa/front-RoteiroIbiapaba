<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-blue-700 mb-6 text-center">Meu Perfil</h1>
  
        <div class="flex flex-col items-center space-y-4">
          <img
            :src="foto"
            alt="Avatar"
            class="w-24 h-24 rounded-full bg-gray-300 object-cover"
          />

          <p class="text-lg text-gray-700 font-semibold">
            {{ username }}
          </p>
          <p class="text-gray-500 text-sm">Usuário registrado no Roteiro Ibiapaba</p>
        </div>
  
        <div class="mt-8 flex justify-center">
          <Button
            @click="logout"
            color="danger"
            rounded>
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Button from '../components/UI/Button.vue'

  const router = useRouter()

  const username = ref(localStorage.getItem('username') || 'Usuário')

  // Usa a imagem salva — se não houver, mostra imagem padrão
 const foto = ref(localStorage.getItem('foto') || 'https://cdn-icons-png.flaticon.com/512/149/149071.png')


  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    localStorage.removeItem('foto')
    router.push('/login')
  }
  </script>

    