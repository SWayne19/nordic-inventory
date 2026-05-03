<!-- Reusable pagination bar with Previous and Next buttons. -->
<template>
    <div class="px-6 py-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <span>Page {{ meta.current_page }} of {{ meta.last_page }}</span>
        <div class="space-x-2">
            <button @click="$emit('change-page', meta.current_page - 1)" :disabled="meta.current_page <= 1" class="cursor-pointer px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">Previous</button>
            <button @click="$emit('change-page', meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page" class="cursor-pointer px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">Next</button>
        </div>
    </div>
</template>

<script setup>
// Receive pagination metadata as a prop. Emits page change events to parent.
defineProps({
    meta: { type: Object, required: true },
});

defineEmits(['change-page']);
</script>
