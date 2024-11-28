import React from 'react';
import styles from './Home.module.css';
import OpenLayers from '../components/OpenLayers';

function Home() {
  return (
      <div className={styles.container}>
        <div className={styles.filter}>
          <p>Placeholder for filters</p>
        </div>
        <div className={styles.map}>
          <OpenLayers id="geo_server" />
        </div>
      </div>
  );
}

export default Home;
