import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import TouristDetail from '../pages/TouristDetail.vue'
import Login from '../pages/Login.vue'
import Perfil from '../pages/Perfil.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/ponto/:id', component: TouristDetail },
  { path: '/login', component: Login },
  { path: '/perfil', component: Perfil },
  {
    path: '/gerar-roteiro',
    component: () => import('../pages/GerarRoteiro.vue'),
    meta: { requiresAuth: true } // 👈 Adicionamos esta linha
  },
  {
    path: '/register',
    component: () => import('../pages/Register.vue')
  },
  {
    path: '/explorar',
    component: () => import('../pages/Explorar.vue'),
  },
  {
    path: '/turismo/:id',
    name: 'TouristDetail',
    component: () => import('../pages/TouristDetail.vue') // caminho correto para seu componente
  },
  {
  path: '/contato',
  name: 'ContatoAnuncie',
  component: () => import('../pages/ContatoAnuncie.vue')
  },
  {
  path: '/obrigado',
  name: 'Obrigado',
  component: () => import('../pages/Obrigado.vue') // ou views/Obrigado.vue
  },

  
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 👇 Aqui corrigido
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access') // era 'token', agora é 'access'
  if (to.meta.requiresAuth && !token) {
    next('/login') // Se não tiver access, manda pro login
  } else {
    next() // Se tiver, segue
  }
})


export default router
