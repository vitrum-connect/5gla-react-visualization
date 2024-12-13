import React, {useEffect} from 'react';

import {Feature, Map, View} from 'ol';
import {Coordinate} from 'ol/coordinate';
import {Extent} from "ol/extent";
import {Point, Polygon} from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from 'ol/proj';
import {OSM} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style} from 'ol/style';

import 'ol/ol.css';
import styles from './OpenLayers.module.css';

import AgriCrop from '../models/AgriCrop';
import Sensor from '../models/Sensor';
import SensorResponse from '../models/SensorResponse';
import TenantGroup from '../models/TenantGroup';
import {getAgvolutionSensorsLocations, getSentekSensorsLocations} from '../services/fiwareService';

interface Props {
    id: string,
    agriCrops: AgriCrop[],
    selectedGroup: TenantGroup|undefined,
    sensors: Sensor[]
}

const style = new Style({
    fill: new Fill({
        color: 'rgba(0, 128, 255, 0.4)',
    }),
    stroke: new Stroke({
        color: 'blue',
        width: 2,
    }),
});

function OpenLayers({ agriCrops, id, selectedGroup, sensors }: Props) {

    const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
    });

    const pointFeatures: Feature<Point>[] = [];
    const polygonFeatures: Feature<Polygon>[] = [];

    const pointVectorSource = new VectorSource({ features: pointFeatures });
    const polygonVectorSource = new VectorSource({ features: polygonFeatures });

    const pointVectorLayer = new VectorLayer({ source: pointVectorSource });
    const polygonVectorLayer = new VectorLayer({ source: polygonVectorSource });

    useEffect(() => {
        const map = new Map({
            target: id,
            layers: [ osmLayer, polygonVectorLayer, pointVectorLayer ],
            view: new View({
                center: [0, 0],
                zoom: 0,
            }),
        });

        function fitMap(extent: Extent | undefined) {
            if (extent && extent.length === 4 && extent.every((element: number): boolean => isFinite(element))) {
                map.getView().fit(extent, { padding: [50, 50, 50, 50] });
            }
        }

        function handleSensorsResponse(_sensors: SensorResponse[]) {
            if (Array.isArray(_sensors)) {
                _sensors.map((_sensor: SensorResponse) => {
                    removeSensorByIdAndType(_sensor.id, _sensor.type);
                    if (_sensor.location !== null) {
                        sensors.push({
                            id: _sensor.id,
                            type: _sensor.type,
                            coordinates: _sensor.location.coordinates
                        });
                    }
                });
                updateSensors();
            }
        }

        function removeSensorByIdAndType(id: string, type: string) {
            const index: number = sensors
                .findIndex((sensor: Sensor): boolean => sensor?.id === id && sensor.type === type);
            if (index >= 0) {
                sensors.splice(index, 1);
            }
        }

        function updateAgriCrops () {
            const features: Feature<Polygon>[] = [];
            agriCrops.map((agriCrop: AgriCrop) => {
                const lonLatCoordinates: Coordinate[] = [];
                agriCrop.coordinates.map((coordinate) => {
                    lonLatCoordinates.push(fromLonLat(coordinate));
                });
                const polygonFeature = new Feature({ geometry: new Polygon([lonLatCoordinates]) });
                polygonFeature.setStyle(style);
                features.push(polygonFeature);
            });
            polygonVectorSource.clear();
            polygonVectorSource.addFeatures(features);
            fitMap(polygonVectorSource.getExtent());
        }

        function updateSensors() {
            const features: Feature<Point>[] = [];
            sensors.map((sensor: Sensor) => {
                features.push(new Feature({ geometry: new Point(fromLonLat(sensor.coordinates)) }));
            });
            pointVectorSource.clear();
            pointVectorSource.addFeatures(features);
        }

        getAgvolutionSensorsLocations()
            .then((response) => handleSensorsResponse(response.data))
            .catch((error) => {
                console.debug(error);
            });

        getSentekSensorsLocations()
            .then((response) => handleSensorsResponse(response.data))
            .catch((error) => {
                console.debug(error);
            });

        return () => map.setTarget(undefined)
    }, []);

    useEffect(() => {
        const features: Feature<Polygon>[] = [];
        const _agriCrops = agriCrops.filter((agriCrop) => {
            return !selectedGroup || agriCrop.customGroup === selectedGroup.groupId;
        });
        _agriCrops.map((_agriCrop: AgriCrop) => {
            const lonLatCoordinates: Coordinate[] = [];
            _agriCrop.coordinates.map((coordinate) => {
                lonLatCoordinates.push(fromLonLat(coordinate));
            });
            const polygonFeature = new Feature({ geometry: new Polygon([lonLatCoordinates]) });
            polygonFeature.setStyle(style);
            features.push(polygonFeature);
        });
        polygonVectorSource.clear();
        polygonVectorSource.addFeatures(features);
    }, [selectedGroup]);

    useEffect(() => {
        const features: Feature<Polygon>[] = [];
        agriCrops.map((agriCrop: AgriCrop) => {
            const lonLatCoordinates: Coordinate[] = [];
            agriCrop.coordinates.map((coordinate) => {
                lonLatCoordinates.push(fromLonLat(coordinate));
            });
            const polygonFeature = new Feature({ geometry: new Polygon([lonLatCoordinates]) });
            polygonFeature.setStyle(style);
            features.push(polygonFeature);
        });
        polygonVectorSource.clear();
        polygonVectorSource.addFeatures(features);
        // fitMap(polygonVectorSource.getExtent());
    }, [agriCrops]);

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;