<!-- Dismissible toast notification that auto-hides after 5 seconds. -->
<template>
    <div v-if="toast.show" :class="toast.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' : 'bg-green-50 border-l-4 border-green-500 text-green-700'" class="mb-4 p-3 flex items-start justify-between text-sm rounded-r shadow-sm transition-all duration-300">
        <span>{{ toast.message }}</span>
        <button @click="dismissToast" class="ml-3 cursor-pointer flex-shrink-0 opacity-60 hover:opacity-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup>
// Access toast state and dismiss handler from shared state.
import { inject } from 'vue';

const { toast, dismissToast } = inject('dashboard');
</script>
