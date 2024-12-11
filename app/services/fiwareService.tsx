import axios, {AxiosInstance} from 'axios';

const baseUrlFiwareServer: string = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : import.meta.env.VITE_FIWARE_SERVER_BASE_URL;
const entitiesApiUrlFiwareServer: string = baseUrlFiwareServer + '/v2/entities/';

function getRequestInstanceFromFiwareServer(): AxiosInstance {
    return axios.create({
        baseURL: entitiesApiUrlFiwareServer,
        headers: { 'fiware-service': 'dev' }
    });
}

function getRequestFromFiwareServer(params = {}, headers = {}) {
    return getRequestInstanceFromFiwareServer().get(entitiesApiUrlFiwareServer, { headers: headers, params: params });
}

export function getAgvolutionSensorsLocations() {
    return getRequestFromFiwareServer({
        type: 'AgvolutionSensor',
        attrs: 'location',
        options: 'keyValues'
    });
}

export function getSentekSensorsLocations() {
    return getRequestFromFiwareServer({
        type: 'SentekSensor',
        attrs: 'location',
        options: 'keyValues'
    });
}

export function getAgriCropPolygon() {
    return getRequestFromFiwareServer({
        type: 'AgriCrop',
        attrs: 'location',
        options: 'keyValues'
    });
}
