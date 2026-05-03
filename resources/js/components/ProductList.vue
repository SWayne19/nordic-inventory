<!-- Product list with search bar, loading states, and pagination. -->
<template>
    <div class="bg-white shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-[#002f5b]">Products</h2>
            <span v-if="productsMeta?.total" class="text-xs text-gray-400">{{ productsMeta.total }} items</span>
        </div>

        <!-- Search input -->
        <div class="px-6 py-3 border-b border-gray-100">
            <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    v-model="searchQuery"
                    @input="onSearchInput"
                    type="text"
                    placeholder="Search products..."
                    class="w-full pl-9 pr-8 py-2 border border-gray-200 rounded text-sm focus:border-[#002f5b] focus:ring-0 outline-none placeholder:text-gray-400"
                />
                <button v-if="searchQuery" @click="clearSearch" class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Loading spinner -->
        <div v-if="productsLoading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-[#002f5b]" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <!-- Error state with retry button -->
        <div v-else-if="productsLoadError" class="text-center py-12">
            <p class="text-red-600 text-sm mb-3">{{ productsLoadError }}</p>
            <button @click="fetchProducts" class="cursor-pointer text-[#002f5b] text-sm font-medium hover:underline">Try again</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="products.length === 0" class="text-gray-400 text-center py-12">
            <p v-if="searchQuery">No products match "{{ searchQuery }}".</p>
            <p v-else>No products available.</p>
        </div>

        <!-- Product items -->
        <div v-else class="divide-y divide-gray-50">
            <ProductItem
                v-for="product in products"
                :key="product.id"
                :product="product"
            />
        </div>

        <!-- Pagination controls -->
        <PaginationBar
            v-if="productsMeta && products.length"
            :meta="productsMeta"
            @change-page="fetchProducts"
        />
    </div>
</template>

<script setup>
// Access product state, search, and fetch logic from shared state.
import { inject } from 'vue';
import ProductItem from './ProductItem.vue';
import PaginationBar from './PaginationBar.vue';

const { products, productsMeta, productsLoading, productsLoadError, searchQuery, fetchProducts, onSearchInput, clearSearch } = inject('dashboard');
</script>
