<template>
  <div class="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
    <PageHeader />
    
    <!-- Data Source Status -->
    <DataSourceStatus 
      :data-source="dataSource" 
      :is-loading="loading" 
      @refresh="refreshData" 
    />
    
    <LoadingState :loading="loading" message="Loading ladders..." />
    
    <ErrorState v-if="error && !loading" :error="error" />
    
    <!-- Main Content -->
    <div v-if="!loading && !error" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Responsive layout: two columns on lg+ with sticky sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Ladders span 2 columns on desktop -->
        <div class="lg:col-span-2">
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
        </div>
        
        <!-- Sidebar: sticky on desktop, hidden header in compact mode -->
        <aside class="hidden lg:block lg:col-span-1">
          <div class="sticky top-6">
            <CombinedLadder :combined-data="combined" compact />
          </div>
        </aside>
      </div>

      <!-- Fallback: show full combined ladder below on mobile/tablet -->
      <div class="lg:hidden">
        <CombinedLadder :combined-data="combined" />
      </div>
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
import DataSourceStatus from './components/DataSourceStatus.vue';
import '@material/web/all.js';

const loading = ref(true);
const error = ref('');
const afl = ref([]);
const aflw = ref([]);
const dataSource = ref(null);
const lastUpdated = ref(null);

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

// AFL API configuration (from scrape-ladders.js)
const AFL_API_CONFIG = {
  afl: {
    // Only attempt API calls in development (where proxy handles CORS)
    // In production (GitHub Pages), skip API and use cached data directly
    url: import.meta.env.DEV ? '/api/afl/v2/compseasons/73/ladders?roundId=' : null,
    fallback: `${BASE}data/afl.json`
  },
  aflw: {
    url: import.meta.env.DEV ? '/api/afl/v2/compseasons/84/ladders?roundId=' : null,
    fallback: `${BASE}data/aflw.json`
  }
};

const AFL_API_HEADERS = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'account': 'afl',
  'cache-control': 'no-cache',
  'dnt': '1',
  'origin': 'https://www.afl.com.au',
  'pragma': 'no-cache',
  'priority': 'u=1, i',
  'referer': 'https://www.afl.com.au/',
  'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'sec-gpc': '1',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
};

function canonicalKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Fetch data from AFL API with fallback to local JSON
async function fetchLadderData(type) {
  const config = AFL_API_CONFIG[type];
  if (!config) throw new Error(`Unknown ladder type: ${type}`);
  
  // In production, skip API and go straight to cached data
  if (!config.url) {
    console.log(`Using cached ${type.toUpperCase()} data (production mode)`);
    try {
      const response = await fetch(config.fallback);
      if (!response.ok) {
        throw new Error(`Cached data fetch failed: ${response.status}`);
      }
      const data = await response.json();
      console.log(`✓ Loaded ${data.length} ${type.toUpperCase()} teams from cached data`);
      return { data, source: 'cached' };
    } catch (error) {
      console.error(`Failed to load cached ${type} data:`, error.message);
      throw new Error(`Failed to load ${type} data`);
    }
  }
  
  try {
    console.log(`Attempting to fetch ${type.toUpperCase()} data from AFL API...`);
    
    // Use proxy in development
    const response = await fetch(config.url);
    
    if (!response.ok) {
      throw new Error(`AFL API returned ${response.status}`);
    }
    
    const json = await response.json();
    const entries = json.ladders?.[0]?.entries || [];
    
    if (entries.length === 0) {
      throw new Error('No ladder entries found in AFL API response');
    }
    
    const data = entries.map(entry => ({
      team: entry.team.name,
      wins: entry.thisSeasonRecord?.winLossRecord?.wins ?? 0,
      key: canonicalKey(entry.team.name)
    }));
    
    console.log(`✓ Successfully fetched ${data.length} ${type.toUpperCase()} teams from AFL API`);
    return { data, source: 'api' };
    
  } catch (apiError) {
    console.warn(`AFL API failed for ${type}:`, apiError.message);
    console.log(`Falling back to cached data: ${config.fallback}`);
    
    try {
      const response = await fetch(config.fallback);
      if (!response.ok) {
        throw new Error(`Cached data fetch failed: ${response.status}`);
      }
      const data = await response.json();
      console.log(`✓ Loaded ${data.length} ${type.toUpperCase()} teams from cached fallback`);
      return { data, source: 'cached' };
    } catch (fallbackError) {
      console.error(`Both AFL API and cached fallback failed for ${type}:`, fallbackError.message);
      throw new Error(`Failed to load ${type} data from both API and cached source`);
    }
  }
}

// Fetch last updated timestamp
async function fetchLastUpdated() {
  try {
    const response = await fetch(`${BASE}data/last-updated.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch timestamp: ${response.status}`);
    }
    const data = await response.json();
    return data.lastUpdated;
  } catch (error) {
    console.warn('Failed to fetch last updated timestamp:', error.message);
    return null;
  }
}

function fetchLadders() {
  loading.value = true;
  error.value = '';
  dataSource.value = null;
  lastUpdated.value = null;
  
  Promise.all([
    fetchLadderData('afl'),
    fetchLadderData('aflw'),
    fetchLastUpdated()
  ]).then(([aflResult, aflwResult, lastUpdatedResult]) => {
    afl.value = aflResult.data;
    aflw.value = aflwResult.data;
    lastUpdated.value = lastUpdatedResult;
    
    // Determine data source status with timestamp
    const hasApi = aflResult.source === 'api' || aflwResult.source === 'api';
    const hasCached = aflResult.source === 'cached' || aflwResult.source === 'cached';
    
    if (hasApi && !hasCached) {
      dataSource.value = {
        type: 'api',
        message: 'Live data from AFL API',
        timestamp: new Date().toISOString()
      };
    } else if (hasCached && !hasApi) {
      dataSource.value = {
        type: 'cached',
        message: 'Cached data',
        timestamp: lastUpdated.value
      };
    } else {
      dataSource.value = {
        type: 'mixed',
        message: 'Mixed live and cached data',
        timestamp: lastUpdated.value
      };
    }
    
    loading.value = false;
  }).catch(e => {
    error.value = `Failed to load ladder data: ${e.message}`;
    loading.value = false;
    console.error('Ladder loading error:', e);
  });
}

function refreshData() {
  fetchLadders();
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
