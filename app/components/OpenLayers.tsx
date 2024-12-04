import React, { useEffect } from 'react';
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import { OSM } from 'ol/source';
import VectorSource from "ol/source/Vector";
import { Feature, Map, View } from 'ol';

import 'ol/ol.css';
import styles from './OpenLayers.module.css';

interface Props {
    id: string
}

const examplePoints: Coordinate[] = [
    [1508323, 7107716],
    [2508323, 8107716],
];

function OpenLayers({ id }: Props) {

    const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
    });

    const features: Feature<Point>[] = examplePoints.map((coordinate: Coordinate): Feature<Point> => {
        return new Feature({
            geometry: new Point(coordinate)
        });
    });

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

        const extent = vectorSource.getExtent();
        if (extent) {
            map.getView().fit(extent, { padding: [50, 50, 50, 50] });
        }

        return () => map.setTarget(undefined)
    });

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;