<template>
  <div>
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useAuthStore } from './stores/auth'
import { useFavoritesStore } from './stores/favorites'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    favoritesStore.loadFavorites()
  }
})

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      favoritesStore.loadFavorites()
    }
  }
)
</script>
