import {
    isRouteErrorResponse,
    Links,
    LinksFunction,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration, useRouteError
} from 'react-router';

import stylesheet from './app.css?url';
import React from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';
import Header from './components/Header';
import styles from './root.module.css';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
]

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>5GLa Visualization</title>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className={styles.container}>
            <Header/>
            <Breadcrumbs/>
            <div className={styles.content}>{children}</div>
            <Footer/>
        </div>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}

export function ErrorBoundary() {
    const error = useRouteError();

    let message = 'Oops!';
    let details = 'An unexpected error occured.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details = error.status === 404 ? "The requested page could not be found" : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}