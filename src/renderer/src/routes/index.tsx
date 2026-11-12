import { type RouteObject } from 'react-router-dom';
import { WithMenu } from '@renderer/components/Menu';
import { homeRoutes } from './Home';
import { appsRoutes } from './Apps';

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
    return addMenu(...homeRoutes(), ...appsRoutes());
}

export { getRoutes };
