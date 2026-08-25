import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'

export const apiPublic = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiPrivate = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Injeta token de acesso Bearer em todas as requisições autenticadas
apiPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de resposta para renovação automática do JWT via refresh token
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('Refresh token não encontrado')
        }

        const res = await apiPublic.post('auth/refresh/', { refresh: refreshToken })
        const newAccessToken = res.data.access

        localStorage.setItem('access', newAccessToken)
        apiPrivate.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        return apiPrivate(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
        localStorage.removeItem('foto')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiPrivate
