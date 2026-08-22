<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-blue-700">Acesse sua conta</h2>
        <p class="text-sm text-gray-500 mt-1">Descubra e monte roteiros incríveis na Serra da Ibiapaba</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input
          label="E-mail"
          v-model="email"
          type="email"
          required
          autocomplete="username"
          placeholder="seuemail@exemplo.com"
        />
        <Input
          label="Senha"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
        />

        <div class="pt-2">
          <Button
            type="submit"
            full
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading">Entrando...</span>
            <span v-else>Entrar</span>
          </Button>

          <p class="text-sm text-center text-gray-600 mt-4">
            Não tem uma conta?
            <router-link to="/register" class="text-blue-600 hover:underline font-medium">Cadastre-se</router-link>
          </p>

          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>

          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="authStore.loading"
            class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-xl font-medium shadow-sm transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              class="h-5 w-5"
            />
            Entrar com Google
          </button>
        </div>

        <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm text-center rounded-lg border border-red-100">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Input from '../components/UI/Input.vue'
import Button from '../components/UI/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''
    await authStore.login(email.value, password.value)
    router.push('/gerar-roteiro')
  } catch (err) {
    error.value = authStore.error || 'E-mail ou senha inválidos.'
  }
}

const handleGoogleLogin = async () => {
  try {
    error.value = ''
    await authStore.loginWithGoogle()
    router.push('/gerar-roteiro')
  } catch (err) {
    error.value = authStore.error || 'Falha ao autenticar com o Google.'
  }
}
</script>
