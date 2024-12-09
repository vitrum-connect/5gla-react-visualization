import React, { useEffect } from 'react';
import { Extent } from "ol/extent";
import { Point } from "ol/geom";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Feature, Map, View } from 'ol';

import 'ol/ol.css';
import styles from './OpenLayers.module.css';
import { getAgvolutionSensorsLocations, getSentekSensorsLocations } from '../services/fiwareService';

interface Props {
    id: string
}

interface SensorResponse {
    id: string,
    type: string,
    location: {
        type: string,
        coordinates: number[]
    } | null
}

interface Sensor {
    id: string,
    type: string,
    coordinates: number[]
}

function removeSensorByIdAndType(sensors: Sensor[], id: string, type: string) {
    const index: number = sensors
        .findIndex((element: Sensor): boolean => element.id === id && element.type === type);
    if (index >= 0) {
        delete sensors[index];
    }
}

function updateSensors(map: Map, vectorSource: VectorSource<Feature<Point>>, features: Feature<Point>[], sensors: Sensor[]) {
    features.length = 0;
    sensors.map((sensor: Sensor) => {
        features.push(new Feature({ geometry: new Point(fromLonLat(sensor.coordinates)) }));
    });
    vectorSource.clear();
    vectorSource.addFeatures(features);
    fitMap(map, vectorSource.getExtent());
}

function fitMap(map: Map, extent: Extent | undefined) {
    if (extent && extent.length === 4 && extent.every((element: number): boolean => isFinite(element))) {
        map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
}

function handleSensorsResponse(_sensors: SensorResponse[], map: Map, vectorSource: VectorSource<Feature<Point>>, features: Feature<Point>[], sensors: Sensor[]) {
    if (Array.isArray(_sensors)) {
        _sensors.map((_sensor: SensorResponse) => {
            removeSensorByIdAndType(sensors, _sensor.id, _sensor.type);
            if (_sensor.location !== null) {
                sensors.push({
                    id: _sensor.id,
                    type: _sensor.type,
                    coordinates: _sensor.location.coordinates
                });
            }
            updateSensors(map, vectorSource, features, sensors);
        });
    }
}

function OpenLayers({ id }: Props) {

    const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
    });

    const features: Feature<Point>[] = [];
    const sensors: Sensor[] = [];

    const vectorSource = new VectorSource({
        features: features
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    useEffect(() => {
        const map = new Map({
            target: id,
            layers: [ osmLayer, vectorLayer ],
            view: new View({
                center: [0, 0],
                zoom: 0,
            }),
        });

        getAgvolutionSensorsLocations()
            .then((response) => handleSensorsResponse(
                response.data,
                map,
                vectorSource,
                features,
                sensors
            ))
            .catch((error) => {
                console.debug(error);
            });

        getSentekSensorsLocations()
            .then((response) => handleSensorsResponse(
                response.data,
                map,
                vectorSource,
                features,
                sensors
            ))
            .catch((error) => {
                console.debug(error);
            });

        return () => map.setTarget(undefined)
    });

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;