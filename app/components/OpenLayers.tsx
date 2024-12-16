import React, {useEffect, useRef} from 'react';

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
import TenantGroup from '../models/TenantGroup';

interface Props {
    id: string,
    agriCrops: AgriCrop[],
    selectedGroup: TenantGroup|undefined,
    sensors: Sensor[]
}

function fitMap(mapView: View | undefined, extent: Extent | undefined) {
    if (mapView && extent && extent.length === 4 && extent.every((element: number): boolean => isFinite(element))) {
        mapView.fit(extent, { padding: [50, 50, 50, 50] });
    }
}

function OpenLayers({ agriCrops, id, selectedGroup, sensors }: Props) {

    const mapRef = useRef<Map | undefined>(undefined);

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

    const style = new Style({
        fill: new Fill({
            color: 'rgba(0, 128, 255, 0.4)',
        }),
        stroke: new Stroke({
            color: 'blue',
            width: 2,
        }),
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
            polygonFeature.setStyle(style);
            features.push(polygonFeature);
        });
        polygonVectorSource.clear();
        polygonVectorSource.addFeatures(features);
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
            features.push(new Feature({ geometry: new Point(fromLonLat(sensor.coordinates)) }));
        });
        pointVectorSource.clear();
        pointVectorSource.addFeatures(features);
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
    }, [agriCrops, selectedGroup]);

    useEffect(() => {
        if (mapRef.current && sensors.length > 0) {
            const map = mapRef.current;
            updateSensors();
        }
    }, [sensors]);

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;