<template>
  <div class="group">
    <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 lg:p-6 transition-all duration-200 hover:shadow-xl">
      <div class="flex items-center justify-center mb-4">
        <div :class="headerClass" class="px-4 py-2 rounded-lg font-semibold text-sm sm:text-base tracking-wide ring-1">
          {{ title }}
        </div>
      </div>
      <Container
        :group-name="groupName"
        @drop="onDrop"
        :drag-class="dragClass"
        :drop-class="dropClass"
        :get-ghost-parent="getGhostParent"
        class="relative flex flex-col gap-2">
        <Draggable v-for="(team, idx) in teams" :key="team.key">
          <div :class="itemClass" class="group/item flex items-center gap-3 bg-slate-50/70 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl cursor-grab px-4 py-3 transition-colors">
            <div :class="badgeClass" class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs sm:text-sm font-semibold ring-1">
              {{ idx+1 }}
            </div>
            <TeamLogo 
              :team-key="getTeamKey(team)"
              :team-name="getDisplayName(team)"
              size="sm"
            />
            <span :class="textClass" class="flex-1 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
              {{ getDisplayName(team) }}
            </span>
            <div class="opacity-60 group-hover/item:opacity-100 transition-opacity">
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 01-2-2v-2"></path>
              </svg>
            </div>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd';
import TeamLogo from './TeamLogo.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  teams: {
    type: Array,
    required: true
  },
  teamCanonicalMap: {
    type: Object,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'blue', // 'blue' or 'pink'
    validator: (value) => ['blue', 'pink'].includes(value)
  }
})

const emit = defineEmits(['drop'])

const onDrop = (dropResult) => {
  emit('drop', dropResult)
}

// Ensure drag ghost is rendered under <body> to avoid offset issues
const getGhostParent = () => document.body

// Build a quick lookup so any alias or key maps to the canonical display
const displayIndex = computed(() => {
  const map = new Map()
  for (const [key, info] of Object.entries(props.teamCanonicalMap)) {
    const display = info?.display || key
    map.set(String(key).toLowerCase(), display)
    for (const alias of info?.aliases || []) {
      map.set(String(alias).toLowerCase(), display)
    }
  }
  return map
})

function getDisplayName(team) {
  const candidates = [team?.key, team?.team].filter(Boolean)
  for (const c of candidates) {
    const name = displayIndex.value.get(String(c).toLowerCase())
    if (name) return name
  }
  return team?.team || team?.key || ''
}

function getTeamKey(team) {
  // Try to find the canonical key for the team
  const candidates = [team?.key, team?.team].filter(Boolean)
  for (const c of candidates) {
    const lowerC = String(c).toLowerCase()
    // Check if it's already a canonical key
    if (props.teamCanonicalMap[lowerC]) return lowerC
    // Check if it matches any aliases and return the canonical key
    for (const [key, info] of Object.entries(props.teamCanonicalMap)) {
      if (info?.aliases?.some(alias => String(alias).toLowerCase() === lowerC)) {
        return key
      }
    }
  }
  return team?.key || team?.team || ''
}

const isBlue = props.variant === 'blue'

const headerClass = isBlue 
  ? 'bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:ring-blue-900'
  : 'bg-pink-50 text-pink-800 ring-pink-200 dark:bg-pink-950/30 dark:text-pink-200 dark:ring-pink-900'

const dragClass = isBlue
  ? '!bg-blue-100/60 dark:!bg-blue-900/40'
  : '!bg-pink-100/60 dark:!bg-pink-900/40'

const dropClass = isBlue
  ? '!bg-blue-50/60 dark:!bg-blue-800/40'
  : '!bg-pink-50/60 dark:!bg-pink-800/40'

const itemClass = isBlue
  ? 'hover:bg-blue-50/70 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700'
  : 'hover:bg-pink-50/70 dark:hover:bg-pink-900/30 hover:border-pink-200 dark:hover:border-pink-700'

const badgeClass = isBlue
  ? 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800'
  : 'bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:ring-pink-800'

const textClass = isBlue
  ? 'group-hover/item:text-blue-700 dark:group-hover/item:text-blue-300'
  : 'group-hover/item:text-pink-700 dark:group-hover/item:text-pink-300'
</script>
