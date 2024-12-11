import {reactRouter} from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        css: {
            postcss: {
                plugins: [autoprefixer]
            }
        },
        plugins: [reactRouter()],
        server: {
            proxy: {
                '/v2/entities': env.VITE_FIWARE_SERVER_BASE_URL
            }
        }
    }
});