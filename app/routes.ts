import {index, route, RouteConfig} from '@react-router/dev/routes';

export default [
    index('./routes/Home.tsx'),
    route('impressum', './routes/Impressum.tsx'),
    route('group/:groupId', './routes/Group.tsx')
] satisfies RouteConfig;