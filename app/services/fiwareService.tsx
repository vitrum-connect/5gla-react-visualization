import axios, {AxiosInstance} from 'axios';

const baseUrlFiwareServer: string = 'http://46.253.253.122:30003';
const entitiesApiUrlFiwareServer: string = baseUrlFiwareServer + '/v2/entities/';

function getRequestInstanceFromFiwareServer(): AxiosInstance {
    return axios.create({
        baseURL: entitiesApiUrlFiwareServer,
        headers: {
            'fiware-server': 'dev',
            'Accept': '*/*'
        },
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