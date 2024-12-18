import {NavLink, useLocation} from 'react-router';
import styles from './Breadcrumbs.module.css';

const routeLabels: { [key: string]: string } = {
    group: 'Gruppe',
    impressum: 'Impressum'
};

const routeWithoutLink: string[] = [
    'group'
];

function calculateNavLinkClassNames(isActive: boolean, disabled: boolean) {
    const classNames: string[] = [];
    if (isActive) {
        classNames.push(styles.active);
    }
    if (disabled) {
        classNames.push('disabled');
    }
    return classNames.join(' ');
}

function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
        <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                key="home"
            >
                Startseite
            </NavLink>
            {pathnames.map((pathname, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const label: string = routeLabels[pathname] || pathname;
                const disabled = routeWithoutLink.includes(pathname);
                return <NavLink
                    to={disabled ? to : '#'}
                    className={({ isActive }) => calculateNavLinkClassNames(isActive, disabled)}
                    key={pathname}
                >
                    {decodeURIComponent(label)}
                </NavLink>;
            })}
        </nav>
    );
}

export default Breadcrumbs;