import { type RouteObject } from 'react-router-dom';
import { WithMenu } from '@renderer/components/Menu';
import { homeRoutes } from './Home';
import { appsRoutes } from './Apps';
import { foldersRoutes } from './Folders';
import { filesRoutes } from './Files';
import { swapsRoutes } from './Swaps';

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
    return addMenu(
        ...homeRoutes(),
        ...appsRoutes(),
        ...foldersRoutes(),
        ...filesRoutes(),
        ...swapsRoutes()
    );
}

export { getRoutes };
