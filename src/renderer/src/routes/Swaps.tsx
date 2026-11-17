import { RouteObject } from 'react-router-dom';
import { SwapsGrid } from '../components/Grids';

function swapsRoutes(): RouteObject[] {
    return [
        {
            path: '/swaps/:sourceId?',
            element: <SwapsGrid />,
        },
        /*{
            path: '/swaps/:swaoId',
            Component: SwapView,
        },*/
    ];
}

export { swapsRoutes };
