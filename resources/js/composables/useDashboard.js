// Shared state and logic for the entire dashboard.
// Provides reactive data, computed values, and methods to child components.
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

export function useDashboard() {
    const router = useRouter();

    // State for products
    const products = ref([]);
    const productsMeta = ref(null);
    const productsLoading = ref(false);
    const productsLoadError = ref('');

    // State for cart
    const cart = reactive({});
    const orderLoading = ref(false);

    // State for toast notifications
    const toast = reactive({ show: false, message: '', type: 'success' });

    // State for orders
    const orders = ref([]);
    const ordersMeta = ref(null);
    const ordersLoading = ref(false);
    const ordersLoadError = ref('');

    // State for user and modals
    const user = ref(null);
    const userLoading = ref(false);
    const showLogoutModal = ref(false);
    const logoutLoading = ref(false);

    // Search state
    const searchQuery = ref('');

    // Debounce and timeout handles
    let searchDebounce = null;
    let toastTimeout = null;

    // Build cart items from the reactive cart object and products list
    const cartItems = computed(() => {
        return Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const product = products.value.find(p => p.id == id);
                if (!product) return null;
                return { id: product.id, name: product.name, price: parseFloat(product.price), qty, stock: product.stock };
            })
            .filter(Boolean);
    });

    // Total number of unique items in cart
    const cartItemCount = computed(() => cartItems.value.length);

    // Total price of all cart items
    const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0));

    // Generate user initials from name or email
    const userInitials = computed(() => {
        if (!user.value) return '?';
        const parts = user.value.name?.trim().split(' ').filter(Boolean);
        if (!parts?.length) return user.value.email?.[0]?.toUpperCase() || '?';
        return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    });

    // Format number to 2 decimal places for currency
    function formatPrice(value) {
        return Number(value).toFixed(2);
    }

    // Format ISO date to readable string
    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    // Show a toast message and auto-hide after 5 seconds
    function showToast(message, type = 'success') {
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.show = true;
        toast.message = message;
        toast.type = type;
        toastTimeout = setTimeout(() => {
            toast.show = false;
        }, 5000);
    }

    // Manually hide the toast
    function dismissToast() {
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.show = false;
    }

    // Fetch products with optional page and search filter
    async function fetchProducts(page = 1) {
        productsLoading.value = true;
        productsLoadError.value = '';
        try {
            let path = `/products?page=${page}`;
            if (searchQuery.value) {
                path = `/products?search=${encodeURIComponent(searchQuery.value)}&page=${page}`;
            }
            const response = await api.get(path);
            const data = response.data.data || [];
            products.value = Array.isArray(data) ? data : [];
            productsMeta.value = {
                current_page: response.data.current_page || 1,
                last_page: response.data.last_page || 1,
                total: response.data.total || 0,
                prev_page_url: response.data.prev_page_url || null,
                next_page_url: response.data.next_page_url || null,
            };
        } catch (err) {
            if (!err.response) {
                productsLoadError.value = 'Network error. Please check your connection.';
            } else if (err.response.status === 401) {
                productsLoadError.value = 'Session expired. Please log in again.';
                router.push('/login');
            } else {
                productsLoadError.value = err.response.data?.message || 'Failed to load products.';
            }
        } finally {
            productsLoading.value = false;
        }
    }

    // Debounce search input to avoid rapid API calls
    function onSearchInput() {
        if (searchDebounce) clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            fetchProducts();
        }, 300);
    }

    // Clear search and reset to page 1
    function clearSearch() {
        searchQuery.value = '';
        fetchProducts();
    }

    // Increase cart item quantity, capped at available stock
    function incrementQty(item) {
        if (item.qty >= item.stock) return;
        cart[item.id]++;
    }

    // Decrease cart item quantity
    function decrementQty(item) {
        if (item.qty > 1) {
            cart[item.id]--;
        }
    }

    // Remove item from cart entirely
    function removeFromCart(item) {
        delete cart[item.id];
    }

    // Submit cart as an order to the backend
    async function placeOrder() {
        orderLoading.value = true;
        dismissToast();

        const items = cartItems.value.map(item => ({
            product_id: item.id,
            quantity: item.qty,
        }));

        if (items.length === 0) {
            showToast('Cart is empty.', 'error');
            orderLoading.value = false;
            return;
        }

        try {
            const response = await api.post('/orders', { items });
            showToast(response.data.message || 'Order placed successfully!', 'success');
            Object.keys(cart).forEach(key => delete cart[key]);
            await fetchProducts();
            await fetchOrders();
        } catch (err) {
            if (!err.response) {
                showToast('Network error. Please try again.', 'error');
            } else if (err.response.status === 400) {
                showToast(err.response.data?.message || 'One or more items are unavailable.', 'error');
            } else if (err.response.status === 422) {
                const msgs = Object.values(err.response.data.errors || {}).flat();
                showToast(msgs.join(' '), 'error');
            } else if (err.response.status === 401) {
                showToast('Session expired.', 'error');
                router.push('/login');
            } else {
                showToast(err.response.data?.message || 'Failed to place order.', 'error');
            }
        } finally {
            orderLoading.value = false;
        }
    }

    // Fetch user's orders with pagination
    async function fetchOrders(page = 1) {
        ordersLoading.value = true;
        ordersLoadError.value = '';
        try {
            const path = `/orders?page=${page}`;
            const response = await api.get(path);
            const data = response.data.data || [];
            orders.value = Array.isArray(data) ? data : [];
            ordersMeta.value = {
                current_page: response.data.current_page || 1,
                last_page: response.data.last_page || 1,
                total: response.data.total || 0,
                prev_page_url: response.data.prev_page_url || null,
                next_page_url: response.data.next_page_url || null,
            };
        } catch (err) {
            if (!err.response) {
                ordersLoadError.value = 'Network error. Please check your connection.';
            } else if (err.response.status === 401) {
                ordersLoadError.value = 'Session expired. Please log in again.';
                router.push('/login');
            } else {
                ordersLoadError.value = err.response.data?.message || 'Failed to load orders.';
            }
            orders.value = [];
        } finally {
            ordersLoading.value = false;
        }
    }

    // Fetch current user from API, fallback to localStorage on failure
    async function fetchUser() {
        userLoading.value = true;
        try {
            const response = await api.get('/user');
            if (response.data) {
                user.value = {
                    id: response.data.id ?? null,
                    name: String(response.data.name || '').trim() || 'User',
                    email: String(response.data.email || '').trim() || '',
                };
                localStorage.setItem('user', JSON.stringify(response.data));
            }
        } catch (err) {
            if (err.response?.status === 401) {
                router.push('/login');
            } else {
                loadUser();
            }
        } finally {
            userLoading.value = false;
        }
    }

    // Load user data from localStorage as fallback
    function loadUser() {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null) return;
            if (!parsed.name && !parsed.email) return;
            user.value = {
                id: parsed.id ?? null,
                name: String(parsed.name || '').trim() || 'User',
                email: String(parsed.email || '').trim() || '',
            };
        } catch {
        }
    }

    // Call logout API and clear stored credentials
    async function handleLogout() {
        logoutLoading.value = true;
        try {
            await api.post('/logout');
        } catch {
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            showLogoutModal.value = false;
            router.push('/login');
        }
    }

    // Clear all timers when component unmounts
    function cleanup() {
        if (searchDebounce) clearTimeout(searchDebounce);
        if (toastTimeout) clearTimeout(toastTimeout);
    }

    // Initialize data fetches and attach event listeners
    function init() {
        fetchUser();
        fetchProducts();
        fetchOrders();
    }

    function teardown() {
        cleanup();
    }

    return {
        products, productsMeta, productsLoading, productsLoadError,
        cart, orderLoading,
        toast,
        orders, ordersMeta, ordersLoading, ordersLoadError,
        user, userLoading, showLogoutModal, logoutLoading,
        searchQuery,
        cartItems, cartItemCount, cartTotal, userInitials,
        formatPrice, formatDate, showToast, dismissToast,
        fetchProducts, onSearchInput, clearSearch,
        incrementQty, decrementQty, removeFromCart,
        placeOrder, fetchOrders, fetchUser, handleLogout,
        init, teardown,
    };
}
