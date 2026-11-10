import { type RouteObject } from 'react-router-dom';
import { homeRoutes } from './Home';
import { WithMenu } from '@renderer/components/Menu';

function addMenu(...routes: RouteObject[]): RouteObject[] {
    return routes.map((route) => {
        if (route.element) {
            return {
                ...route,
                element: <WithMenu>{route.element}</WithMenu>,
            };
        }
        return route;
    });
}

function getRoutes(): RouteObject[] {
    return addMenu(...homeRoutes());
}

export { getRoutes };
