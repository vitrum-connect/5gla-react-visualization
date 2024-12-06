import {index, route, RouteConfig} from '@react-router/dev/routes';

export default [
    index('./routes/Home.tsx'),
    route('impressum', './routes/Impressum.tsx')
] satisfies RouteConfig;