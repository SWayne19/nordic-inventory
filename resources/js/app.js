import "./bootstrap";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";

// set routes 
const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "Login", component: Login },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
    },
];

// router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// navigation guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("auth_token");
    if (to.meta.requiresAuth && !token) {
        next({ name: "Login" });
    } else if (to.name === "Login" && token) {
        next({ name: "Dashboard" });
    } else {
        next();
    }
});

// vue application mount
const app = createApp(App);
app.use(router);
app.mount("#app");
