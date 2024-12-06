import {reactRouter} from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import {defineConfig} from 'vite';

export default defineConfig({
    css: {
        postcss: {
            plugins: [autoprefixer]
        }
    },
    plugins: [reactRouter()],
    server: {
        proxy: {
            '/v2/entities': 'http://46.253.253.122:30003'
        }
    }
});