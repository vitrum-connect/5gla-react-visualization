import React, {useEffect, useRef} from 'react';

import {Feature, Map, View} from 'ol';
import {Coordinate} from 'ol/coordinate';
import {Extent} from 'ol/extent';
import {Point, Polygon} from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from 'ol/proj';
import {OSM} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style} from 'ol/style';
import CircleStyle from 'ol/style/Circle';

import 'ol/ol.css';
import styles from './OpenLayers.module.css';

import AgriCrop from '../models/AgriCrop';
import Sensor from '../models/Sensor';
import TenantGroup from '../models/TenantGroup';

const polygonVectorLayerName = 'polygonVectorLayer';
const pointVectorLayerName = 'pointVectorLayer';

function createPolygonVectorLayer(name: string, source: VectorSource<Feature<Polygon>>) {
    const vectorSource = new VectorLayer({ source: source });
    vectorSource.set('name', name);
    return vectorSource;
}

function createPointVectorLayer(name: string, source: VectorSource<Feature<Point>>) {
    const vectorSource = new VectorLayer({ source: source });
    vectorSource.set('name', name);
    return vectorSource;
}

interface Props {
    id: string,
    agriCrops: AgriCrop[],
    selectedAgriCrop?: AgriCrop|undefined,
    selectedGroup: TenantGroup|undefined,
    selectedSensor?: Sensor|undefined,
    sensors: Sensor[]
}

function fitMap(mapView: View | undefined, extent: Extent | undefined) {
    if (!mapView) {
        return;
    }
    if (extent && extent.length === 4 && extent.every((element: number): boolean => isFinite(element))) {
        mapView.fit(extent, { padding: [50, 50, 50, 50] });
    } else {
        mapView.setCenter([0, 0]);
        mapView.setZoom(0);
    }
}

function OpenLayers({ agriCrops, id, selectedAgriCrop, selectedGroup, selectedSensor, sensors }: Props) {

    const mapRef = useRef<Map | undefined>(undefined);

    const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
    });

    const pointFeatures: Feature<Point>[] = [];
    const polygonFeatures: Feature<Polygon>[] = [];

    const pointVectorSource = new VectorSource({ features: pointFeatures });
    const polygonVectorSource = new VectorSource({ features: polygonFeatures });

    let pointVectorLayer = createPointVectorLayer(pointVectorLayerName, pointVectorSource);
    let polygonVectorLayer = createPolygonVectorLayer(polygonVectorLayerName, polygonVectorSource);

    const normalPolygonStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 128, 255, 0.4)',
        }),
        stroke: new Stroke({
            color: 'blue',
            width: 2,
        }),
    });

    const highlightPolygonStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.4)',
        }),
        stroke: new Stroke({
            color: 'red',
            width: 2,
        }),
    });

    const highlightPointStyle = new Style({
        image: new CircleStyle({
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.4)'
            }),
            stroke: new Stroke({
                color: 'red',
                width: 1
            }),
            radius: 5
        })
    });

    function updateAgriCrops () {
        const map = mapRef.current;
        if (!map || agriCrops.length === 0) return;
        const features: Feature<Polygon>[] = [];
        const _agriCrops = agriCrops.filter((agriCrop) => {
            return !selectedGroup || agriCrop.customGroup === selectedGroup.groupId;
        });
        _agriCrops.forEach((agriCrop: AgriCrop) => {
            const lonLatCoordinates: Coordinate[] = [];
            agriCrop.coordinates.map((coordinate) => {
                lonLatCoordinates.push(fromLonLat(coordinate));
            });
            const polygonFeature = new Feature({ geometry: new Polygon([lonLatCoordinates]) });
            polygonFeature.setStyle(agriCrop.id === selectedAgriCrop?.id ? highlightPolygonStyle : normalPolygonStyle);
            features.push(polygonFeature);
        });
        polygonVectorSource.clear();
        polygonVectorSource.addFeatures(features);
        const vectorLayerToRemove = map.getLayers().getArray()
            .find(layer => layer.get('name') === polygonVectorLayerName);
        if (vectorLayerToRemove) {
            map.removeLayer(vectorLayerToRemove);
        }
        polygonVectorLayer = createPolygonVectorLayer(polygonVectorLayerName, polygonVectorSource);
        map.addLayer(polygonVectorLayer);
        fitMap(map.getView(), polygonVectorSource.getExtent());
    }

    function updateSensors() {
        const map = mapRef.current;
        if (!map || sensors.length === 0) return;
        const features: Feature<Point>[] = [];
        const _sensors = sensors.filter((sensor) => {
            return !selectedGroup || sensor.customGroup === selectedGroup.groupId;
        });
        _sensors.forEach((sensor: Sensor) => {
            const pointFeature = new Feature({ geometry: new Point(fromLonLat(sensor.coordinates)) });
            if (sensor.id === selectedSensor?.id) {
                pointFeature.setStyle(highlightPointStyle);
            }
            features.push(pointFeature);
        });
        pointVectorSource.clear();
        pointVectorSource.addFeatures(features);
        const vectorLayerToRemove = map.getLayers().getArray()
            .find(layer => layer.get('name') === pointVectorLayerName);
        if (vectorLayerToRemove) {
            map.removeLayer(vectorLayerToRemove);
        }
        pointVectorLayer = createPointVectorLayer(pointVectorLayerName, pointVectorSource);
        map.addLayer(pointVectorLayer);
    }

    useEffect(() => {
        const map = new Map({
            target: id,
            layers: [ osmLayer, polygonVectorLayer, pointVectorLayer ],
            view: new View({
                center: [0, 0],
                zoom: 0,
            }),
        });

        mapRef.current = map;

        return () => map.setTarget(undefined)
    }, []);

    useEffect(() => {
        if (mapRef.current && agriCrops.length > 0) {
            updateAgriCrops();
        }
    }, [agriCrops, selectedGroup, selectedAgriCrop]);

    useEffect(() => {
        if (mapRef.current && sensors.length > 0) {
            updateSensors();
        }
    }, [sensors, selectedGroup, selectedSensor]);

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;