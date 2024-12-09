import React, {useEffect} from 'react';

import {Feature, Map, View} from 'ol';
import {Coordinate} from "ol/coordinate";
import {Extent} from "ol/extent";
import {Point, Polygon} from "ol/geom";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from "ol/proj";
import {OSM} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style} from "ol/style";

import 'ol/ol.css';
import styles from './OpenLayers.module.css';
import {getAgriCropPolygon, getAgvolutionSensorsLocations, getSentekSensorsLocations} from '../services/fiwareService';

interface Props {
    id: string
}

interface SensorResponse {
    id: string,
    type: string,
    location: {
        type: string,
        coordinates: Coordinate
    } | null
}

interface Sensor {
    id: string,
    type: string,
    coordinates: Coordinate
}

interface AgriCropResponse {
    id: string,
    type: string,
    polygon: {
        type: string,
        polygon: Coordinate[]
    }
}

interface AgriCrop {
    id: string,
    polygon: Coordinate[]
}

function removeSensorByIdAndType(sensors: Sensor[], id: string, type: string) {
    const index: number = sensors
        .findIndex((sensor: Sensor): boolean => sensor.id === id && sensor.type === type);
    if (index >= 0) {
        delete sensors[index];
    }
}

function removeAgriCropById(agriCrops: AgriCrop[], id: string) {
    const index: number = agriCrops.findIndex((agriCrop: AgriCrop) => agriCrop.id === id);
    if (index > 0) {
        delete agriCrops[index];
    }
}

function updateSensors(map: Map, vectorSource: VectorSource<Feature<Point>>, sensors: Sensor[]) {
    const features: Feature<Point>[] = [];
    sensors.map((sensor: Sensor) => {
        features.push(new Feature({ geometry: new Point(fromLonLat(sensor.coordinates)) }));
    });
    vectorSource.clear();
    vectorSource.addFeatures(features);
    fitMap(map, vectorSource.getExtent());
}

function updateAgriCrops(map: Map, vectorSource: VectorSource<Feature<Polygon>>, agriCrops: AgriCrop[]) {
    const features: Feature<Polygon>[] = [];
    agriCrops.map((agriCrop: AgriCrop) => {
        const lonLatCoordinates: Coordinate[] = [];
        agriCrop.polygon.map((coordinate) => {
            lonLatCoordinates.push(fromLonLat(coordinate));
        })
        const polygonFeature = new Feature({ geometry: new Polygon([lonLatCoordinates]) });
        polygonFeature.setStyle(style);
        features.push(polygonFeature);
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

function handleSensorsResponse(_sensors: SensorResponse[], map: Map, vectorSource: VectorSource<Feature<Point>>, sensors: Sensor[]) {
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
            updateSensors(map, vectorSource, sensors);
        });
    }
}

function handleAgriCropResponse(_agriCrops: AgriCropResponse[], map: Map, vectorSource: VectorSource<Feature<Polygon>>, agriCrops: AgriCrop[]) {
    if (Array.isArray(_agriCrops)) {
        _agriCrops.map((_agriCrop: AgriCropResponse) => {
            removeAgriCropById(agriCrops, _agriCrop.id)
            agriCrops.push({
                id: _agriCrop.id,
                polygon: _agriCrop.polygon.polygon
            });
        });
        updateAgriCrops(map, vectorSource, agriCrops);
    }
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

function OpenLayers({ id }: Props) {

    const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
    });

    const pointFeatures: Feature<Point>[] = [];
    const polygonFeatures: Feature<Polygon>[] = [];
    const sensors: Sensor[] = [];
    const agriCrops: AgriCrop[] = [];

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

        getAgvolutionSensorsLocations()
            .then((response) => handleSensorsResponse(
                response.data,
                map,
                pointVectorSource,
                sensors
            ))
            .catch((error) => {
                console.debug(error);
            });

        getSentekSensorsLocations()
            .then((response) => handleSensorsResponse(
                response.data,
                map,
                pointVectorSource,
                sensors
            ))
            .catch((error) => {
                console.debug(error);
            });

        getAgriCropPolygon()
            .then((response) => handleAgriCropResponse(
                response.data,
                map,
                polygonVectorSource,
                agriCrops
            ))
            .catch((error) => {
                console.debug(error);
            });

        return () => map.setTarget(undefined)
    });

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;