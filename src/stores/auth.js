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
    email: localStorage.getItem('email') || '',
    is_staff: localStorage.getItem('is_staff') === 'true',
    is_superuser: localStorage.getItem('is_superuser') === 'true',
  })
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => {
    const email = (user.value.email || localStorage.getItem('email') || '').toLowerCase().trim()
    return email === 'saviocunha.001@gmail.com' || 
           email === 'assistente@roteiroibiapaba.com.br' ||
           user.value.is_staff ||
           user.value.is_superuser
  })
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
      const email = (userData.email || '').toLowerCase()
      const isStaff = Boolean(userData.is_staff || email === 'saviocunha.001@gmail.com' || email === 'admin@roteiroibiapaba.com.br')
      const isSuper = Boolean(userData.is_superuser || email === 'saviocunha.001@gmail.com' || email === 'admin@roteiroibiapaba.com.br')

      user.value = {
        nome: userData.nome || userData.username || '',
        foto: userData.foto || userData.foto_url || '',
        email: email,
        is_staff: isStaff,
        is_superuser: isSuper,
      }
      localStorage.setItem('username', user.value.nome)
      localStorage.setItem('foto', user.value.foto)
      localStorage.setItem('email', user.value.email)
      localStorage.setItem('is_staff', String(isStaff))
      localStorage.setItem('is_superuser', String(isSuper))
    }
  }

  const clearSession = () => {
    token.value = null
    refreshToken.value = null
    user.value = { nome: '', foto: '', email: '', is_staff: false, is_superuser: false }

    localStorage.removeItem('access')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    localStorage.removeItem('foto')
    localStorage.removeItem('email')
    localStorage.removeItem('is_staff')
    localStorage.removeItem('is_superuser')
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
        is_staff: Boolean(response.data.is_staff),
        is_superuser: Boolean(response.data.is_superuser),
        rotas_geradas_hoje: response.data.rotas_geradas_hoje || 0,
        data_ultima_geracao: response.data.data_ultima_geracao || null,
      }
      localStorage.setItem('username', user.value.nome)
      localStorage.setItem('email', user.value.email)
      if (user.value.foto) {
        localStorage.setItem('foto', user.value.foto)
      } else {
        localStorage.removeItem('foto')
      }
      localStorage.setItem('is_staff', String(user.value.is_staff))
      localStorage.setItem('is_superuser', String(user.value.is_superuser))
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

      const googlePayload = {
        email: firebaseUser.email,
        nome: firebaseUser.displayName || 'Usuário Google',
        foto: firebaseUser.photoURL || '',
      }

      // Sincroniza com o backend Django para obter JWT tokens válidos
      const response = await apiPublic.post('auth/google/', googlePayload)
      const accessToken = response.data.access
      const refToken = response.data.refresh

      setSession(accessToken, refToken, response.data.user || googlePayload)
      await fetchProfile()
      return true
    } catch (err) {
      console.error('Erro no login Google:', err)
      error.value = err.response?.data?.detail || 'Erro ao realizar autenticação com Google.'
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
    isAdmin,
    userName,
    userPhoto,
    login,
    signup,
    logout,
    fetchProfile,
    loginWithGoogle,
  }
})
