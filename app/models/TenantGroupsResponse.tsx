import TenantGroup from './TenantGroup';

export default interface TenantGroupsResponse {
    timestamp: string,
    groups: TenantGroup[]
}