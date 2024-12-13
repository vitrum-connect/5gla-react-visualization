import SingleLocationResponse from './SingleLocationResponse';

export default interface SensorResponse {
    id: string,
    type: string,
    customGroup: string,
    location: SingleLocationResponse | null
}
