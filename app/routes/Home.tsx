import React from 'react';
import styles from './Home.module.css';
import OpenLayers from '../components/OpenLayers';
import SingleSelectionGroups from '../components/SingleSelectionGroups';
import AgriCrop from '../models/AgriCrop';
import Sensor from '../models/Sensor';

function Home() {
    const sensors: Sensor[] = [];
    const agriCrops: AgriCrop[] = [];
    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <SingleSelectionGroups/>
            </div>
            <div className={styles.map}>
                <OpenLayers id="geo_server" agriCrops={agriCrops} sensors={sensors}/>
            </div>
        </div>
    );
}

export default Home;
