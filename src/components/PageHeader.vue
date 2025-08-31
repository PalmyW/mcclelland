<template>
  <div class="relative flex flex-col py-5 items-center justify-center w-full">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
    <div class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
      <button
        type="button"
        @click="toggleTheme"
        class="inline-flex items-center rounded-full p-2 text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ring-1 ring-slate-200/70 dark:ring-slate-700/70 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      >
        <md-icon v-if="isDark" class="w-5 h-5">light_mode</md-icon>
        <md-icon v-else class="w-5 h-5">dark_mode</md-icon>
        <span class="sr-only">Toggle theme</span>
      </button>
    </div>
    <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
          McClelland Trophy
        </h1>
        <div class="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          2025 Ladder
        </div>
        <div class="max-w-2xl mx-auto space-y-1.5 px-4">
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400">Combined AFL & AFLW club rankings</p>
          <p class="text-sm text-slate-500 dark:text-slate-500">1st = 18 points, 2nd = 17, ..., 18th = 1 point. Highest combined wins.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const isDark = ref(false)

function applyTheme(dark) {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme(isDark.value)
  console.log('Theme toggled to:', isDark.value ? 'dark' : 'light', 'HTML has dark class:', document.documentElement.classList.contains('dark'))
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    // Fallback to system preference on first visit
    isDark.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme(isDark.value)
})
</script>
