<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold text-center mb-6 text-blue-700">Criar Conta</h2>
  
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              v-model="nome"
              type="text"
              required
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <input
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Confirme a Senha</label>
            <input
              v-model="password2"
              type="password"
              required
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div>
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition font-semibold"
            >
              Registrar
            </button>
  
            <p class="text-sm text-center text-gray-600 mt-4">
              Já tem uma conta?
              <router-link to="/login" class="text-blue-600 hover:underline font-medium">Fazer login</router-link>
            </p>
          </div>
          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-sm text-center">{{ success }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const nome = ref('')
  const email = ref('')
  const password = ref('')
  const password2 = ref('')
  const error = ref('')
  const success = ref('')
  const router = useRouter()
  
  const register = async () => {
    error.value = ''
    success.value = ''
  
    if (password.value !== password2.value) {
      error.value = 'As senhas não coincidem.'
      return
    }
  
    try {
      await axios.post('https://api.roteiroibiapaba.com.br/api/auth/signup/', {
       
        email: email.value,
        password: password.value,
        password2: password2.value,
        nome: nome.value
      })
  
      success.value = 'Conta criada com sucesso! Redirecionando...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
  
    } catch (err) {
      console.error(err)
      error.value = 'Erro ao registrar. Verifique os dados.'
    }
  }
  </script>
  