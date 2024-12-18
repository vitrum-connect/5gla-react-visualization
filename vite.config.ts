import {reactRouter} from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import {ConfigEnv, defineConfig, loadEnv, UserConfig} from 'vite';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
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
                '/api/v1/sec/tenant': env.VITE_TENANT_API_SERVER_BASE_URL,
                '/v2/entities': env.VITE_FIWARE_SERVER_BASE_URL
            }
        }
    }
});