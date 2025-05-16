<template>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXXXXXX"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (window.adsbygoogle) {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('Erro ao carregar anúncio:', e)
    }
  }
})
</script>
