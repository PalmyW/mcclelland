<template>
  <tr :class="rowClasses">
    <td class="px-4 sm:px-6 py-3">
      <div class="flex items-center gap-2 sm:gap-3">
        <div v-if="index < 3" :class="medalClass" class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">
          {{ index + 1 }}
        </div>
        <div v-else class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 r flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm">
          {{ index + 1 }}
        </div>
        <span class="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base whitespace-nowrap">{{ row.club }}</span>
      </div>
    </td>
    <td class="px-4 sm:px-6 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
      <span class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 font-semibold text-xs sm:text-sm">
        {{ row.aflRank }}
      </span>
    </td>
    <td class="px-4 sm:px-6 py-3 text-center font-medium text-blue-700 dark:text-blue-300 text-sm sm:text-base">{{ row.aflPoints }}</td>
    <td class="px-4 sm:px-6 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
      <span class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 font-semibold text-xs sm:text-sm">
        {{ row.aflwRank }}
      </span>
    </td>
    <td class="px-4 sm:px-6 py-3 text-center font-medium text-pink-700 dark:text-pink-300 text-sm sm:text-base">{{ row.aflwPoints }}</td>
    <td class="px-4 sm:px-6 py-3 text-center">
      <span class="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 text-slate-800 dark:text-slate-200 font-semibold  text-sm sm:text-base">
        {{ row.combined }}
      </span>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  row: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const rowClasses = computed(() => [
  'border-b border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40',
  props.index === 0 ? 'bg-amber-50 dark:bg-amber-900/15' : '',
  props.index === 1 ? 'bg-slate-50 dark:bg-slate-800/40' : '',
  props.index === 2 ? 'bg-orange-50 dark:bg-orange-900/15' : ''
])

const medalClass = computed(() => {
  switch (props.index) {
    case 0: return 'bg-amber-100 text-amber-800 ring-1 ring-amber-400'
    case 1: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-400'
    case 2: return 'bg-orange-100 text-orange-800 ring-1 ring-orange-400'
    default: return ''
  }
})
</script>
