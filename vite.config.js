import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',  // This makes the dev server accessible on the network
        port: 3000,        // You can change this port if necessary
        hmr: {
            host: '192.168.1.6', // Replace with your machine's local IP address
        },
    },
});
