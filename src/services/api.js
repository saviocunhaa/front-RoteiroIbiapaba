import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://api.roteiroibiapaba.com.br/api/'

export const apiPublic = axios.create({
  baseURL,
})

export const apiPrivate = axios.create({
  baseURL,
})

// Sempre enviar o Authorization se tiver token
apiPrivate.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// INTERCEPTADOR DE RESPOSTA PARA REFRESH
apiPrivate.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Se deu 401 e não está tentando refresh ainda
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('Refresh token não encontrado')
        }

        // Solicita novo token
        const res = await apiPublic.post('auth/refresh/', { refresh: refreshToken })

        const newAccessToken = res.data.access
        localStorage.setItem('access', newAccessToken)

        // Atualiza o Authorization do request original
        apiPrivate.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        // Tenta de novo a requisição original
        return apiPrivate(originalRequest)
      } catch (refreshError) {
        // Se o refresh falhar, limpa tudo e manda pro login
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
