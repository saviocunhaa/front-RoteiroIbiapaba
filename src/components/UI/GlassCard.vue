<template>
  <div 
    class="glass-panel rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group relative"
  >
    <!-- Brilho superior suave -->
    <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div class="relative z-10 p-6 h-full flex flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// GlassCard Component
</script>
