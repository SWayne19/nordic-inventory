<!-- Login page with email and password form. Redirects to dashboard on success. -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-[#f4f7f9] px-4 font-sans">
        <div class="w-full max-w-md">
            <!-- Brand header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-extrabold text-[#002f5b] tracking-tight uppercase">
                    Nordic<span class="text-blue-600">Inventory</span>
                </h1>
            </div>

            <!-- Login form container -->
            <div class="bg-white rounded-none border-t-4 border-[#002f5b] shadow-xl p-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-6 underline decoration-blue-500 decoration-2 underline-offset-8">
                    User Login
                </h2>

                <!-- General error message for non-field errors -->
                <div v-if="generalError" class="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                    {{ generalError }}
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <!-- Email field -->
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Email Address</label>
                        <input
                            v-model="form.email"
                            type="text"
                            :class="['w-full px-4 py-3 border focus:ring-0 transition-all duration-200 outline-none', fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#002f5b]']"
                            placeholder="name@gmail.com"
                            @input="fieldErrors.email = ''"
                        />
                        <p v-if="fieldErrors.email" class="text-red-600 text-xs mt-1">{{ fieldErrors.email }}</p>
                    </div>

                    <!-- Password field with show/hide toggle -->
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Password</label>
                        <div class="relative">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                v-model="form.password"
                                :class="['w-full px-4 py-3 border focus:ring-0 transition-all duration-200 outline-none', fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#002f5b]']"
                                placeholder="••••••••"
                                @input="fieldErrors.password = ''"
                            />
                            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#002f5b]">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            </button>
                        </div>
                        <p v-if="fieldErrors.password" class="text-red-600 text-xs mt-1">{{ fieldErrors.password }}</p>
                    </div>

                    <!-- Submit button -->
                    <button type="submit" :disabled="loading" class="w-full bg-[#002f5b] hover:bg-[#00427a] text-white font-bold py-3 uppercase tracking-widest transition-all duration-300 shadow-lg active:transform active:scale-95 disabled:opacity-70">
                        <span v-if="loading" class="flex items-center justify-center">
                            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Logging In...
                        </span>
                        <span v-else>Log In</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
// Manage form state, validation errors, and login submission.
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();

// Loading spinner state
const loading = ref(false);

// General error message for non-field errors (e.g. wrong credentials)
const generalError = ref("");

// Field-specific validation errors
const fieldErrors = reactive({ email: "", password: "" });

// Password visibility toggle
const showPassword = ref(false);

// Form data bound to inputs
const form = reactive({
    email: "",
    password: "",
});

// Set field errors from backend validation response
function setFieldErrors(errors) {
    if (errors.email?.[0]) fieldErrors.email = errors.email[0];
    if (errors.password?.[0]) fieldErrors.password = errors.password[0];
}

// Set general error message based on HTTP status code
function setGeneralError(status, message) {
    const messages = {
        401: message || "Invalid credentials.",
        422: message || "Validation failed. Please check your input.",
        429: message || "Too many attempts. Please try again later.",
        500: "Server error. Please try again later.",
        503: "Service unavailable. Please try again later.",
    };
    generalError.value = messages[status] || message || "Login failed. Please try again.";
}

// Submit login credentials, store token, and redirect to dashboard
async function handleLogin() {
    generalError.value = "";
    loading.value = true;

    try {
        const response = await api.post("/login", {
            email: form.email.trim(),
            password: form.password,
        });
        // Save auth token and user data for future requests
        localStorage.setItem("auth_token", response.data.access_token);
        if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        router.push("/dashboard");
    } catch (err) {
        if (err.response) {
            // Handle field validation errors vs general errors
            if (err.response.status === 422 && err.response.data?.errors) {
                setFieldErrors(err.response.data.errors);
            } else {
                setGeneralError(err.response.status, err.response.data?.message);
            }
        } else {
            generalError.value = "Network error. Please check your connection.";
        }
    } finally {
        loading.value = false;
    }
}
</script>
