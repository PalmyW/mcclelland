<template>
  <div v-if="shouldShow" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
    <div class="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
      <div class="flex items-center space-x-2">
        <md-icon :class="iconClass">
          {{ iconName }}
        </md-icon>
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ statusMessage }}</span>
          <span v-if="formattedTimestamp" class="text-xs text-slate-600 dark:text-slate-400">
            {{ formattedTimestamp }}
          </span>
        </div>
      </div>
      <button 
        @click="$emit('refresh')"
        :disabled="isLoading"
        class="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium transition-colors"
      >
        <md-icon class="text-sm">refresh</md-icon>
        <span>Refresh</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  dataSource: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh']);

const shouldShow = computed(() => {
  return props.dataSource && !props.isLoading;
});

const iconClass = computed(() => {
  return props.dataSource?.type === 'api' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-blue-600 dark:text-blue-400';
});

const iconName = computed(() => {
  return props.dataSource?.type === 'api' ? 'cloud_done' : 'storage';
});

const statusMessage = computed(() => {
  const type = props.dataSource?.type;
  if (type === 'api') return 'Live AFL data';
  if (type === 'cached') return 'Cached AFL data';
  return 'Mixed AFL data';
});

const formattedTimestamp = computed(() => {
  const timestamp = props.dataSource?.timestamp;
  if (!timestamp) return null;
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return null;
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    // Show actual date for older data
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return null;
  }
});
</script>
