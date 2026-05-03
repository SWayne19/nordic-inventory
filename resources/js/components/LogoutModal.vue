<!-- Confirmation modal before logging out the user. -->
<template>
    <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showLogoutModal = false">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">Confirm Logout</h3>
            </div>
            <p class="text-sm text-gray-500 mb-6">Are you sure you want to log out? You will need to sign in again to access your account.</p>
            <div class="flex gap-3">
                <button @click="showLogoutModal = false" :disabled="logoutLoading" class="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                    Cancel
                </button>
                <button @click="handleLogout" :disabled="logoutLoading" class="cursor-pointer flex-1 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
                    <span v-if="logoutLoading" class="flex items-center justify-center">
                        <svg class="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Logging out...
                    </span>
                    <span v-else>Logout</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Access logout modal state and handler from shared state.
import { inject } from 'vue';

const { showLogoutModal, logoutLoading, handleLogout } = inject('dashboard');
</script>
