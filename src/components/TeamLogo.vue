<template>
  <div class="flex-shrink-0">
    <svg
      v-if="logoExists"
      :class="logoClass"
      :title="`${teamName} logo`"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <use :href="logoSrc" />
    </svg>
    <div
      v-else
      :class="fallbackClass"
      :style="{ backgroundColor: teamColor }"
      :title="`${teamName} logo`"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import logoSprite from '../assets/logos.svg'

const props = defineProps({
  teamKey: {
    type: String,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md' // xs, sm, md, lg
  }
})

const logoExists = ref(true) // Assume logos exist in sprite sheet

// Team colors for fallback logos (if sprite fails)
const TEAM_COLORS = {
  'adelaide-crows': '#FFD100',
  'brisbane-lions': '#A6192E',
  'carlton': '#000080',
  'collingwood': '#000000',
  'essendon': '#CC0000',
  'fremantle': '#2E0C7A',
  'geelong-cats': '#001F3F',
  'gold-coast-suns': '#FFD100',
  'gws-giants': '#FF6600',
  'hawthorn': '#8B4513',
  'melbourne': '#CC0000',
  'north-melbourne': '#005EB8',
  'port-adelaide': '#00BFFF',
  'richmond': '#FFD100',
  'st-kilda': '#FF0000',
  'sydney-swans': '#FF0000',
  'west-coast-eagles': '#FFD100',
  'western-bulldogs': '#FF0000'
}

// Map team keys to AFL official sprite sheet icon IDs
const AFL_SPRITE_MAP = {
  'adelaide-crows': 'icn-aflc-adel',
  'brisbane-lions': 'icn-aflc-bl',
  'carlton': 'icn-aflc-carl',
  'collingwood': 'icn-aflc-coll',
  'essendon': 'icn-aflc-ess',
  'fremantle': 'icn-aflc-fre',
  'geelong-cats': 'icn-aflc-geel',
  'gold-coast-suns': 'icn-aflc-gcfc',
  'gws-giants': 'icn-aflc-gws',
  'hawthorn': 'icn-aflc-haw',
  'melbourne': 'icn-aflc-melb',
  'north-melbourne': 'icn-aflc-nmfc',
  'port-adelaide': 'icn-aflc-port',
  'richmond': 'icn-aflc-rich',
  'st-kilda': 'icn-aflc-stk',
  'sydney-swans': 'icn-aflc-syd',
  'west-coast-eagles': 'icn-aflc-wce',
  'western-bulldogs': 'icn-aflc-wb'
}

const logoSrc = computed(() => {
  const spriteId = AFL_SPRITE_MAP[props.teamKey]
  return spriteId ? `${logoSprite}#${spriteId}` : null
})

const teamColor = computed(() => TEAM_COLORS[props.teamKey] || '#6B7280')

const initials = computed(() => {
  return props.teamName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 3)
    .toUpperCase()
})

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm', 
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg'
}

const logoClass = computed(() => `${sizeClasses[props.size]} rounded-full`)
const fallbackClass = computed(() => 
  `${sizeClasses[props.size]} rounded-full flex items-center justify-center text-white font-bold shadow-sm`
)

// Check if logo exists in sprite sheet
onMounted(() => {
  logoExists.value = !!AFL_SPRITE_MAP[props.teamKey]
})
</script>
