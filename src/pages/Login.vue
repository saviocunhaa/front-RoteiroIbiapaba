<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-blue-700">Entrar</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="username"
            class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition font-semibold"
          >
            Entrar
          </button>

          <p class="text-sm text-center text-gray-600 mt-4">
            Não tem uma conta?
            <router-link to="/register" class="text-blue-600 hover:underline font-medium">Cadastre-se</router-link>
          </p>
          
        </div>


        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiPublic, apiPrivate } from '../services/api'

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''

    const response = await apiPublic.post('/auth/login/', {
      email: email.value,
      password: password.value,
    })

    const accessToken = response.data.access
    const refreshToken = response.data.refresh

    localStorage.setItem('access', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    apiPrivate.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    const profileResponse = await apiPrivate.get('/profile/')
    localStorage.setItem('username', profileResponse.data.nome)
    localStorage.setItem('foto', profileResponse.data.foto)

    window.location.assign('/gerar-roteiro') // ⚡
  } catch (err) {
    console.error('Erro no login:', err)
    error.value = 'E-mail ou senha inválidos ou erro de conexão.'
  }
}
</script>
