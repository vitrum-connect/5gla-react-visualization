import axios, {AxiosInstance} from 'axios';

const baseUrlTenantApi: string = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : import.meta.env.VITE_TENANT_API_SERVER_BASE_URL;
const tenantApiUrl: string = '/api/v1/sec/tenant/';
const groupsTenantApiURL: string = tenantApiUrl + 'groups/';

function getRequestInstanceFromTenantApiServer(): AxiosInstance {
    return axios.create({
        baseURL: baseUrlTenantApi,
        headers: {
            'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_TENANT_API_USERNAME}:${import.meta.env.VITE_TENANT_API_PASSWORD}`)
        }
    });
}

export function getTenantGroups() {
    return getRequestInstanceFromTenantApiServer().get(groupsTenantApiURL);
}
