import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        // laravel plugins
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),

        // vue plugins
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),

        // tailwind plugins
        tailwindcss(),
    ],
    resolve: {
        // alias for vue
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});
