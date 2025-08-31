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
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75C6.615 21.75 2.25 17.385 2.25 12 2.25 7.31 5.53 3.45 10.02 2.43c.5-.12.96.33.82.83A8.25 8.25 0 0 0 19.5 12c0 1.89-.63 3.63-1.69 5.02-.31.4.06.98.57.82 1.22-.38 2.35-1.02 3.37-1.84.43-.34.11-1.06-.41-.98a9.7 9.7 0 0 1-.57-.04z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M12 4.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 12 4.75zm0 14.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75zM4.75 12a.75.75 0 0 1 .75-.75v-.5a.75.75 0 0 1 1.5 0v.5A.75.75 0 0 1 6.25 12a.75.75 0 0 1-.75.75v.5a.75.75 0 0 1-1.5 0v-.5A.75.75 0 0 1 4.75 12zm12.5 0a.75.75 0 0 1 .75-.75v-.5a.75.75 0 0 1 1.5 0v.5a.75.75 0 0 1-.75.75.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1-.75-.75zM7.22 7.22a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 0 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06zm8.15 8.15a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06zM7.22 16.78a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 0 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06zm8.15-8.15a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06zM12 8.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25z"/>
        </svg>
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
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme(isDark.value)
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
