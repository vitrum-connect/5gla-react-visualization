import React from 'react';
import styles from './Home.module.css';
import OpenLayers from '../components/OpenLayers';
import SingleSelectionGroups from '../components/SingleSelectionGroups';

function Home() {
  return (
      <div className={styles.container}>
        <div className={styles.filter}>
          <SingleSelectionGroups />
        </div>
        <div className={styles.map}>
          <OpenLayers id="geo_server" />
        </div>
      </div>
  );
}

export default Home;
