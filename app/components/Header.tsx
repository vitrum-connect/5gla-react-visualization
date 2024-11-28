import React from 'react';
import styles from './Header.module.css';
import {Link} from 'react-router';

function Header() {
    return <Link className={styles.header} to="/">AquaBrain</Link>;
}

export default Header;