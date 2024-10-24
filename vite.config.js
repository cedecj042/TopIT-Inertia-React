import { loadEnv } from 'vite';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: env.VITE_HOST,  
            port: env.VITE_PORT_NUMBER,
            hmr: {
                host: env.VITE_IP_ADDRESS,
            },
        },
    };
});
