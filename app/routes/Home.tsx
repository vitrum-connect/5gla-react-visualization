import React from 'react';
import styles from './Home.module.css';

function Home() {
  return (
      <div className={styles.container}>
        <div className={styles.filter}>
          <p>Placeholder for filters</p>
        </div>
        <div className={styles.map}>
          <p>Placeholder for map</p>
        </div>
      </div>
  );
}

export default Home;
