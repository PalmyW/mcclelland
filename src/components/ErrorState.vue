<template>
  <div v-if="error" class="flex justify-center py-14 sm:py-16 px-4">
    <div class="rounded-xl px-5 py-3 text-center max-w-md ring-1 ring-red-200 dark:ring-red-900/40 bg-red-50/70 dark:bg-red-900/20 text-red-700 dark:text-red-300">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    required: true
  }
})
</script>
