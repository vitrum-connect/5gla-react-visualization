import {reactRouter} from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import {defineConfig} from 'vite';

export default defineConfig({
    css: {
        postcss: {
            plugins: [autoprefixer]
        }
    },
    plugins: [reactRouter()]
});