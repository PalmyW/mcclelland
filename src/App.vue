<template>
  <div class="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
    <PageHeader />
    
    <LoadingState :loading="loading" message="Loading ladders..." />
    
    <ErrorState v-if="error && !loading" :error="error" />
    
    <!-- Main Content -->
    <div v-if="!loading && !error" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Ladders Section -->
      <div class="grid grid-cols-1 py-4 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
        <LadderCard
          title="AFL Ladder"
          :teams="afl"
          :team-canonical-map="TEAM_CANONICAL_MAP"
          group-name="afl"
          variant="blue"
          @drop="onDropAFL"
        />
        
        <LadderCard
          title="AFLW Ladder"
          :teams="aflw"
          :team-canonical-map="TEAM_CANONICAL_MAP"
          group-name="aflw"
          variant="pink"
          @drop="onDropAFLW"
        />
      </div>
            
      <CombinedLadder :combined-data="combined" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PageHeader from './components/PageHeader.vue';
import LoadingState from './components/LoadingState.vue';
import ErrorState from './components/ErrorState.vue';
import LadderCard from './components/LadderCard.vue';
import CombinedLadder from './components/CombinedLadder.vue';
import '@material/web/all.js';

const loading = ref(true);
const error = ref('');
const afl = ref([]);
const aflw = ref([]);

// Vite base path ("/" in dev, "/mcclelland/" on Pages)
const BASE = import.meta.env.BASE_URL || '/';

// Canonical team map for display and matching (multiple possible names/aliases)
const TEAM_CANONICAL_MAP = {
  'adelaide-crows': {
    display: 'Adelaide Crows',
    aliases: ['Adelaide Crows', 'Kuwarna', 'Adelaide Crows (Kuwarna)']
  },
  'brisbane-lions': {
    display: 'Brisbane Lions',
    aliases: ['Brisbane Lions']
  },
  'carlton': {
    display: 'Carlton',
    aliases: ['Carlton']
  },
  'collingwood': {
    display: 'Collingwood',
    aliases: ['Collingwood']
  },
  'essendon': {
    display: 'Essendon',
    aliases: ['Essendon']
  },
  'fremantle': {
    display: 'Fremantle',
    aliases: ['Fremantle', 'Walyalup', 'Fremantle (Walyalup)']
  },
  'geelong-cats': {
    display: 'Geelong Cats',
    aliases: ['Geelong Cats']
  },
  'gold-coast-suns': {
    display: 'Gold Coast SUNS',
    aliases: ['Gold Coast SUNS']
  },
  'gws-giants': {
    display: 'GWS GIANTS',
    aliases: ['GWS GIANTS']
  },
  'hawthorn': {
    display: 'Hawthorn',
    aliases: ['Hawthorn']
  },
  'melbourne': {
    display: 'Melbourne',
    aliases: ['Melbourne', 'Narrm', 'Melbourne (Narrm)']
  },
  'north-melbourne': {
    display: 'North Melbourne',
    aliases: ['North Melbourne', 'Kangaroos', 'North Melbourne (Kangaroos)', 'North Melbourne Football Club']
  },
  'port-adelaide': {
    display: 'Port Adelaide',
    aliases: ['Port Adelaide', 'Yartapuulti', 'Port Adelaide (Yartapuulti)']
  },
  'richmond': {
    display: 'Richmond',
    aliases: ['Richmond']
  },
  'st-kilda': {
    display: 'St Kilda',
    aliases: ['St Kilda', 'Euro-Yroke', 'St Kilda (Euro-Yroke)']
  },
  'sydney-swans': {
    display: 'Sydney Swans',
    aliases: ['Sydney Swans']
  },
  'west-coast-eagles': {
    display: 'West Coast Eagles',
    aliases: ['West Coast Eagles', 'Waalitj Marawar', 'West Coast Eagles (Waalitj Marawar)']
  },
  'western-bulldogs': {
    display: 'Western Bulldogs',
    aliases: ['Western Bulldogs']
  },
};

// Helper: get canonical key from any team name
function getCanonicalKey(nameOrKey) {
  const name = nameOrKey.trim();
  // First, check for direct key match
  if (TEAM_CANONICAL_MAP[name]) return name;
  for (const [key, { aliases }] of Object.entries(TEAM_CANONICAL_MAP)) {
    if (aliases.some(alias => name === alias)) return key;
    // Also match if name contains alias or alias contains name (for e.g. "Adelaide Crows (Kuwarna)")
    if (aliases.some(alias => name.includes(alias) || alias.includes(name))) return key;
    // Also match if the key matches (for AFL data)
    if (key === name) return key;
  }
  return null;
}

function fetchLadders() {
  loading.value = true;
  Promise.all([
    fetch(`${BASE}data/afl.json`).then(r => r.json()),
    fetch(`${BASE}data/aflw.json`).then(r => r.json())
  ]).then(([aflData, aflwData]) => {
    afl.value = aflData;
    aflw.value = aflwData;
    loading.value = false;
  }).catch(e => {
    error.value = 'Failed to load ladder data.';
    loading.value = false;
  });
}

onMounted(fetchLadders);

function reorder(list, { removedIndex, addedIndex }) {
  if (removedIndex === null || addedIndex === null) return list;
  const arr = [...list];
  const [item] = arr.splice(removedIndex, 1);
  arr.splice(addedIndex, 0, item);
  return arr;
}

function onDropAFL(dropResult) {
  afl.value = reorder(afl.value, dropResult);
}
function onDropAFLW(dropResult) {
  aflw.value = reorder(aflw.value, dropResult);
}

const combined = computed(() => {
  // Points: 1st = 18, 2nd = 17, ...
  const points = (rank, total) => total - rank + 1;
  const totalAFL = afl.value.length;
  const totalAFLW = aflw.value.length;
  const clubs = {};
  afl.value.forEach((team, idx) => {
    const key = getCanonicalKey(team.key) || getCanonicalKey(team.team) || team.key;
    const display = TEAM_CANONICAL_MAP[key]?.display || team.team;
    clubs[key] = clubs[key] || { club: display };
    clubs[key].aflRank = idx + 1;
    clubs[key].aflPoints = points(idx + 1, totalAFL);
  });
  aflw.value.forEach((team, idx) => {
    const key = getCanonicalKey(team.key) || getCanonicalKey(team.team) || team.key;
    const display = TEAM_CANONICAL_MAP[key]?.display || team.team;
    clubs[key] = clubs[key] || { club: display };
    clubs[key].aflwRank = idx + 1;
    clubs[key].aflwPoints = points(idx + 1, totalAFLW);
  });
  return Object.values(clubs).map(row => ({
    ...row,
    aflRank: row.aflRank || '-',
    aflPoints: row.aflPoints || 0,
    aflwRank: row.aflwRank || '-',
    aflwPoints: row.aflwPoints || 0,
    combined: (row.aflPoints || 0) + (row.aflwPoints || 0)
  })).sort((a, b) => b.combined - a.combined);
});
</script>

<style>
/* Material Web styles are imported via JS, not CSS. */
</style>
