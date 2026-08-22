import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiPublic, apiPrivate } from '../services/api'
import { auth as firebaseAuth, provider as googleProvider, signInWithPopup } from '../services/firebase'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref({
    nome: localStorage.getItem('username') || '',
    foto: localStorage.getItem('foto') || '',
    email: '',
  })
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value.nome || 'Usuário')
  const userPhoto = computed(() => {
    if (user.value.foto && user.value.foto !== 'null') {
      return user.value.foto
    }
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  })

  const setSession = (accessToken, newRefreshToken, userData = null) => {
    token.value = accessToken
    refreshToken.value = newRefreshToken

    localStorage.setItem('access', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    if (userData) {
      user.value = {
        nome: userData.nome || userData.username || '',
        foto: userData.foto || userData.foto_url || '',
        email: userData.email || '',
      }
      localStorage.setItem('username', user.value.nome)
      localStorage.setItem('foto', user.value.foto)
    }
  }

  const clearSession = () => {
    token.value = null
    refreshToken.value = null
    user.value = { nome: '', foto: '', email: '' }

    localStorage.removeItem('access')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    localStorage.removeItem('foto')
  }

  const fetchProfile = async () => {
    if (!token.value) return null
    try {
      const response = await apiPrivate.get('profile/')
      user.value = {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
        foto: response.data.foto || '',
      }
      localStorage.setItem('username', user.value.nome)
      if (user.value.foto) {
        localStorage.setItem('foto', user.value.foto)
      }
      return response.data
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      return null
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiPublic.post('auth/login/', {
        email,
        password,
      })

      const accessToken = response.data.access
      const refToken = response.data.refresh

      setSession(accessToken, refToken, response.data.user || null)
      await fetchProfile()
      return true
    } catch (err) {
      console.error('Erro no login:', err)
      error.value = err.response?.data?.detail || 'E-mail ou senha inválidos.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const signup = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiPublic.post('auth/signup/', userData)
      const accessToken = response.data.access
      const refToken = response.data.refresh
      setSession(accessToken, refToken, response.data.user || null)
      return response.data
    } catch (err) {
      console.error('Erro no cadastro:', err)
      const errorMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        'Erro ao criar conta. Verifique os dados.'
      error.value = errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await apiPrivate.post('auth/logout/', { refresh: refreshToken.value })
      }
    } catch (err) {
      console.warn('Logout API falhou ou token já invalidado:', err)
    } finally {
      clearSession()
    }
  }

  const loginWithGoogle = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider)
      const firebaseUser = result.user

      // Define usuário a partir dos dados retornados pelo Firebase Auth
      user.value = {
        nome: firebaseUser.displayName || 'Usuário Google',
        foto: firebaseUser.photoURL || '',
        email: firebaseUser.email || '',
      }

      // Salva dados locais da sessão do Firebase
      const idToken = await firebaseUser.getIdToken()
      setSession(idToken, idToken, user.value)

      return true
    } catch (err) {
      console.error('Erro no login Google:', err)
      error.value = 'Erro ao realizar autenticação com Google.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Inicializa o perfil se já estiver autenticado
  if (token.value && !user.value.email) {
    fetchProfile()
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userName,
    userPhoto,
    login,
    signup,
    logout,
    fetchProfile,
    loginWithGoogle,
  }
})
