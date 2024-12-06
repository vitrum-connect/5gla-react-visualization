import {NavLink, useLocation} from 'react-router';
import styles from './Breadcrumbs.module.css';

const routeLabels: { [key: string]: string } = {
    impressum: 'Impressum'
};

function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
        <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? styles.active : undefined)}>
                Startseite
            </NavLink>
            {pathnames.map((pathname, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const label: string = routeLabels[pathname] || pathname;
                return <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? styles.active : undefined)}>
                    {decodeURIComponent(label)}
                </NavLink>;
            })}
        </nav>
    );
}

export default Breadcrumbs;