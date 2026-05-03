<!-- Dashboard parent component. Wires all child components together and provides shared state. -->
<template>
    <div class="min-h-screen bg-gray-50">
        <Navbar />
        <UserMenu />

        <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <ToastNotification />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProductList />
                <Cart />
            </div>

            <OrderList />
        </main>

        <LogoutModal />
    </div>
</template>

<script setup>
// Provide the dashboard composable state to all child components via injection.
import { provide, onMounted, onUnmounted } from 'vue';
import { useDashboard } from '../composables/useDashboard';
import Navbar from './Navbar.vue';
import UserMenu from './UserMenu.vue';
import ToastNotification from './ToastNotification.vue';
import ProductList from './ProductList.vue';
import Cart from './Cart.vue';
import OrderList from './OrderList.vue';
import LogoutModal from './LogoutModal.vue';

const dashboard = useDashboard();
provide('dashboard', dashboard);

onMounted(() => {
    dashboard.init();
});

onUnmounted(() => {
    dashboard.teardown();
});
</script>
