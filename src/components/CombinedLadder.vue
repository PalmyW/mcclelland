<template>
  <div class="mt-12 lg:mt-16">
    <div class="text-center mb-6 lg:mb-8 px-4">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Live Combined Ladder
      </h2>
      <p class="text-slate-600 dark:text-slate-400">Real-time rankings based on current ladder positions</p>
    </div>
    
    <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden mx-4 sm:mx-0">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[600px]">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
              <th class="px-4 sm:px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Club</th>
              <th class="px-4 sm:px-6 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">AFL Rank</th>
              <th class="px-4 sm:px-6 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">AFL Pts</th>
              <th class="px-4 sm:px-6 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">AFLW Rank</th>
              <th class="px-4 sm:px-6 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">AFLW Pts</th>
              <th class="px-4 sm:px-6 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Combined</th>
            </tr>
          </thead>
          <tbody>
            <CombinedLadderRow 
              v-for="(row, index) in combinedData" 
              :key="row.club"
              :row="row"
              :index="index"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import CombinedLadderRow from './CombinedLadderRow.vue'

defineProps({
  combinedData: {
    type: Array,
    required: true
  }
})
</script>
