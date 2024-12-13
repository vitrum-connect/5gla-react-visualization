import MultiLocationResponse from './MultiLocationResponse';

export default interface AgriCropResponse {
    id: string,
    type: string,
    customGroup: string,
    location: MultiLocationResponse
}
