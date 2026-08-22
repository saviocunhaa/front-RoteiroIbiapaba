<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-blue-700">Criar sua conta</h2>
        <p class="text-sm text-gray-500 mt-1">Junte-se à comunidade do Roteiro Ibiapaba</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <Input
          label="Nome Completo"
          v-model="nome"
          type="text"
          required
          placeholder="Seu nome"
        />

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
          autocomplete="new-password"
          placeholder="Mínimo 8 caracteres"
        />

        <Input
          label="Confirme a Senha"
          v-model="password2"
          type="password"
          required
          autocomplete="new-password"
          placeholder="Repita sua senha"
        />

        <div class="pt-2">
          <Button
            type="submit"
            full
            :disabled="loading"
          >
            <span v-if="loading">Criando conta...</span>
            <span v-else>Cadastrar</span>
          </Button>

          <p class="text-sm text-center text-gray-600 mt-4">
            Já tem uma conta?
            <router-link to="/login" class="text-blue-600 hover:underline font-medium">Fazer login</router-link>
          </p>
        </div>

        <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm text-center rounded-lg border border-red-100">
          {{ error }}
        </div>

        <div v-if="success" class="p-3 bg-green-50 text-green-700 text-sm text-center rounded-lg border border-green-100">
          {{ success }}
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

const nome = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== password2.value) {
    error.value = 'As senhas não coincidem.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'A senha deve ter pelo menos 8 caracteres.'
    return
  }

  loading.value = true

  try {
    await authStore.signup({
      nome: nome.value,
      email: email.value,
      password: password.value,
      password2: password2.value,
    })

    success.value = 'Conta criada com sucesso! Redirecionando...'
    setTimeout(() => {
      router.push('/gerar-roteiro')
    }, 1200)
  } catch (err) {
    error.value = authStore.error || 'Erro ao realizar o cadastro. Verifique os dados.'
  } finally {
    loading.value = false
  }
}
</script>