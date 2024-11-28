import React, { useEffect } from 'react';

import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { Map, View } from 'ol';

import 'ol/ol.css';
import styles from './OpenLayers.module.css';

interface Props {
    id: string
}

function OpenLayers({ id }: Props) {
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const map = new Map({
            target: id,
            layers: [ osmLayer ],
            view: new View({
                center: [0, 0],
                zoom: 0,
            }),
        });
        return () => map.setTarget(undefined)
    });

    return <div id={id} className={styles.map}></div>;
}

export default OpenLayers;