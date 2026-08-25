import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/explorar',
    name: 'Explorar',
    component: () => import('../pages/Explorar.vue'),
  },
  {
    path: '/mapa',
    name: 'MapaInterativo',
    alias: ['/mapa-da-serra', '/mapa-interativo'],
    component: () => import('../pages/MapaInterativo.vue'),
  },
  {
    path: '/pontos/:id',
    name: 'TouristDetail',
    alias: ['/ponto/:id', '/turismo/:id'],
    component: () => import('../pages/TouristDetail.vue'),
  },
  {
    path: '/gerar-roteiro',
    name: 'GerarRoteiro',
    component: () => import('../pages/GerarRoteiro.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../pages/Perfil.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/minhas-viagens',
    name: 'MinhasViagens',
    component: () => import('../pages/MinhasViagens.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/sugerir-atrativo',
    name: 'SugerirAtrativo',
    alias: ['/cadastrar-atrativo', '/sugerir-ponto', '/colaborar'],
    component: () => import('../pages/SugerirAtrativo.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin-painel',
    name: 'AdminPainel',
    alias: ['/painel-admin', '/admin-destinos', '/admin'],
    component: () => import('../pages/AdminPainel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/contato',
    name: 'ContatoAnuncie',
    component: () => import('../pages/ContatoAnuncie.vue'),
  },
  {
    path: '/obrigado',
    name: 'Obrigado',
    component: () => import('../pages/Obrigado.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Guarda de navegação com Pinia
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'GerarRoteiro' })
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.warn('Bloqueado: Usuário não é admin.', {
      email: authStore.user?.email,
      is_staff: authStore.user?.is_staff,
      isAdmin: authStore.isAdmin
    })
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
