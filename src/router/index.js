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
