<template>
  <button 
    class="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-95 group"
    :class="[
      variant === 'primary' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400' : 
      variant === 'secondary' ? 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50' : 
      'bg-slate-800 hover:bg-slate-700'
    ]"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    ref="buttonRef"
  >
    <!-- Efeito de brilho no hover que segue o mouse -->
    <span 
      class="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :style="{
        background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.25) 0%, transparent 60%)`
      }"
      v-if="variant === 'primary'"
    ></span>
    
    <span class="relative z-10 flex items-center gap-2">
      <slot></slot>
      <span class="transform transition-transform duration-300 group-hover:translate-x-1" v-if="withArrow">→</span>
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, dark
  },
  withArrow: {
    type: Boolean,
    default: false
  }
})

const buttonRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e) => {
  if (!buttonRef.value) return
  const rect = buttonRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const handleMouseLeave = () => {
  mouseX.value = 0
  mouseY.value = 0
}
</script>
