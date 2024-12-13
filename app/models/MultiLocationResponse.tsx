import {Coordinate} from 'ol/coordinate';

export default interface MultiLocationResponse {
    type: string,
    coordinates: Coordinate[]
}
