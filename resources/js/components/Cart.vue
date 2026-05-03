<!-- Shopping cart showing items, quantity controls, total, and checkout button. -->
<template>
    <div class="bg-white shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-[#002f5b]">Cart</h2>
            <span v-if="cartItemCount" class="bg-[#002f5b] text-white text-xs px-2 py-0.5 rounded-full">{{ cartItemCount }}</span>
        </div>

        <!-- Empty cart state -->
        <div v-if="cartItemCount === 0" class="text-gray-400 text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <p class="text-sm">Your cart is empty.</p>
            <p class="text-xs mt-1">Add products to get started.</p>
        </div>

        <!-- Cart items and checkout -->
        <div v-else>
            <div class="divide-y divide-gray-50">
                <CartItem
                    v-for="item in cartItems"
                    :key="item.id"
                    :item="item"
                />
            </div>

            <div class="px-6 py-4 border-t border-gray-100">
                <div class="flex justify-between items-center text-lg font-semibold text-[#002f5b] mb-4">
                    <span>Total</span>
                    <span>{{ formatPrice(cartTotal) }} MMK</span>
                </div>
                <button
                    @click="placeOrder"
                    :disabled="orderLoading || cartItemCount === 0"
                    class="cursor-pointer w-full bg-[#002f5b] hover:bg-[#00427a] text-white font-bold py-3 uppercase tracking-widest transition-all duration-300 shadow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span v-if="orderLoading" class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Placing Order...
                    </span>
                    <span v-else>Place Order</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Access cart state, totals, and order submission from shared state.
import { inject } from 'vue';
import CartItem from './CartItem.vue';

const { cartItems, cartItemCount, cartTotal, orderLoading, formatPrice, placeOrder } = inject('dashboard');
</script>
