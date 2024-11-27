import styles from './Footer.module.css';
import {NavLink} from 'react-router';

function Footer() {

    const links = [
        { url: '/impressum', label: 'Impressum' },
    ];

    const list = links.map((link, index) => {
        return <NavLink to={link.url} key={index}>{ link.label }</NavLink>
    });

    return <nav className={styles.footer}>{ list }</nav>;
}

export default Footer;