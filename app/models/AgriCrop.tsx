import {Coordinate} from 'ol/coordinate';

export default interface AgriCrop {
    id: string,
    customGroup: string,
    coordinates: Coordinate[]
}
