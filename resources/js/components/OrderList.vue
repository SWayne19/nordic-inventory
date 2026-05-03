<!-- Order history list with loading, error, empty states, and pagination. -->
<template>
    <div class="mt-8 bg-white shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-[#002f5b]">Recent Orders</h2>
            <span v-if="ordersMeta?.total" class="text-xs text-gray-400">{{ ordersMeta.total }} orders</span>
        </div>

        <!-- Loading spinner -->
        <div v-if="ordersLoading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-[#002f5b]" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <!-- Error state -->
        <div v-else-if="ordersLoadError" class="text-center py-12">
            <p class="text-red-600 text-sm mb-3">{{ ordersLoadError }}</p>
            <button @click="fetchOrders" class="cursor-pointer text-[#002f5b] text-sm font-medium hover:underline">Try again</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="orders.length === 0" class="text-gray-400 text-center py-12">
            No orders yet.
        </div>

        <!-- Order items -->
        <div v-else class="divide-y divide-gray-50">
            <div v-for="order in orders" :key="order.id" class="px-6 py-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-800">Order #{{ order.id }}</span>
                    <span class="text-sm font-semibold text-[#002f5b]">{{ formatPrice(order.total_price) }} MMK</span>
                </div>
                <p class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</p>
                <div class="mt-2 flex flex-wrap gap-1">
                    <span v-for="item in order.items" :key="item.id" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {{ item.product?.name || 'Unknown' }} × {{ item.quantity }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Pagination controls -->
        <PaginationBar
            v-if="ordersMeta && orders.length"
            :meta="ordersMeta"
            @change-page="fetchOrders"
        />
    </div>
</template>

<script setup>
// Access order state, formatting helpers, and fetch logic from shared state.
import { inject } from 'vue';
import PaginationBar from './PaginationBar.vue';

const { orders, ordersMeta, ordersLoading, ordersLoadError, formatPrice, formatDate, fetchOrders } = inject('dashboard');
</script>
