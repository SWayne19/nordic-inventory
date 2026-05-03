<!-- Single cart item row with name, line total, and quantity adjust/remove buttons. -->
<template>
    <div class="px-6 py-4 flex justify-between items-center">
        <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-800 truncate">{{ item.name }}</p>
            <p class="text-sm text-gray-500">{{ formatPrice(item.price) }} MMK × {{ item.qty }} = <span class="font-medium text-[#002f5b]">{{ formatPrice(item.price * item.qty) }} MMK</span></p>
        </div>
        <div class="flex items-center gap-1.5 ml-4">
            <button @click="decrementQty(item)" class="cursor-pointer w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 transition text-sm">−</button>
            <span class="w-8 text-center text-sm font-medium">{{ item.qty }}</span>
            <button @click="incrementQty(item)" :disabled="item.qty >= item.stock" class="cursor-pointer w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed">+</button>
            <button @click="removeFromCart(item)" class="cursor-pointer ml-1 w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
// Receive cart item as a prop. Use shared quantity and remove handlers.
import { inject } from 'vue';

defineProps({
    item: { type: Object, required: true },
});

const { formatPrice, incrementQty, decrementQty, removeFromCart } = inject('dashboard');
</script>
