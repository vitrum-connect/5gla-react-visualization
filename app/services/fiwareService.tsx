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
        attrs: 'customGroup,location',
        options: 'keyValues'
    });
}

const agriCropPolygonMock = [
    {
        "id": "urn:ngsi-ld:dev:e8ab4d5d9e1b",
        "type": "AgriCrop",
        "customGroup": "7b526219-6e22-48a0-93a0-5e4894f7034f",
        "location": {
            "type": "Polygon",
            "coordinates": [
                [
                    10.450484876,
                    52.874516477
                ],
                [
                    10.445372713,
                    52.873301317
                ],
                [
                    10.444563451,
                    52.87452839
                ],
                [
                    10.444622666,
                    52.874730913
                ],
                [
                    10.445412189,
                    52.875302739
                ],
                [
                    10.44612276,
                    52.875338478
                ],
                [
                    10.44612276,
                    52.875743516
                ],
                [
                    10.44663595,
                    52.876374891
                ],
                [
                    10.448570282,
                    52.876899045
                ],
                [
                    10.450484876,
                    52.874516477
                ]
            ]
        }
    },
    {
        "id": "urn:ngsi-ld:dev:e8ab4d5d9e1c",
        "type": "AgriCrop",
        "customGroup": "7b526219-6e22-48a0-93a0-5e4894f7034a",
        "location": {
            "type": "Polygon",
            "coordinates": [
                [
                    10.460484876,
                    52.884516477
                ],
                [
                    10.455372713,
                    52.883301317
                ],
                [
                    10.454563451,
                    52.88452839
                ],
                [
                    10.454622666,
                    52.884730913
                ],
                [
                    10.455412189,
                    52.885302739
                ],
                [
                    10.45612276,
                    52.885338478
                ],
                [
                    10.45612276,
                    52.885743516
                ],
                [
                    10.45663595,
                    52.886374891
                ],
                [
                    10.458570282,
                    52.886899045
                ],
                [
                    10.460484876,
                    52.884516477
                ]
            ]
        }
    }
];

export function getAgriCropPolygonExample() {
    return new Promise<axios.AxiosResponse<any>>((resolve) => resolve({
        data: agriCropPolygonMock
    }));
}
