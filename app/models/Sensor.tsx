import {Coordinate} from 'ol/coordinate';

export default interface Sensor {
    id: string,
    type: string,
    customGroup: string,
    coordinates: Coordinate
}
