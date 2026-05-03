<!-- Single product row showing name, price, stock, and quantity input. -->
<template>
    <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div>
            <p class="font-medium text-gray-800">{{ product.name }}</p>
            <p class="text-sm text-gray-500 mt-0.5">
                <span class="font-medium text-[#002f5b]">{{ formatPrice(product.price) }} MMK</span>
                <span class="mx-1">·</span>
                <span :class="product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'">
                    Stock: {{ product.stock }}
                </span>
            </p>
        </div>
        <div v-if="product.stock > 0">
            <input
                v-model.number="cart[product.id]"
                type="number"
                min="1"
                :max="product.stock"
                class="w-16 px-2 py-1.5 border border-gray-200 rounded text-center text-sm focus:border-[#002f5b] focus:ring-0 outline-none"
            />
        </div>
        <span v-else class="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">Out of stock</span>
    </div>
</template>

<script setup>
// Receive product data as a prop. Quantity is synced directly to shared cart.
import { inject } from 'vue';

defineProps({
    product: { type: Object, required: true },
});

const { cart, formatPrice } = inject('dashboard');
</script>
