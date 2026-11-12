import { RouteObject } from 'react-router-dom';
import { AppsGrid } from '../components/AppsGrid';

function appsRoutes(): RouteObject[] {
    return [
        {
            path: '/apps',
            element: <AppsGrid />,
        },
    ];
}

export { appsRoutes };
