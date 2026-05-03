<!-- Top navigation bar with brand, user info, and logout button. -->
<template>
    <nav class="bg-[#002f5b] text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <span class="text-lg font-bold tracking-wide uppercase">Nordic<span class="text-blue-300">Inventory</span></span>
            </div>
            <div class="flex items-center gap-3">
                <div v-if="user" class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-[#002f5b] font-bold text-sm">
                        {{ userInitials }}
                    </div>
                    <div class="hidden sm:block text-left">
                        <p class="text-sm font-medium leading-tight">{{ user.name }}</p>
                        <p class="text-xs text-gray-300 leading-tight">{{ user.email }}</p>
                    </div>
                </div>
                <div v-else class="hidden sm:block text-sm text-gray-300">Loading...</div>
                <button @click="showLogoutModal = true" class="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-medium transition rounded">
                    Logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
// Access shared user and modal state from the parent.
import { inject } from 'vue';

const { user, userInitials, showLogoutModal } = inject('dashboard');
</script>
