<template>
  <div v-if="loading" class="flex items-center justify-center py-14 sm:py-16 px-4">
    <div class="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-5 py-3 shadow-md ring-1 ring-slate-200/70 dark:ring-slate-700/70">
      <div class="w-5 h-5 border-2 border-slate-400/70 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-slate-700 dark:text-slate-300 font-medium">{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>
