import { RouteObject } from 'react-router-dom';
import { SwapsGrid } from '../components/Grids';

function swapsRoutes(): RouteObject[] {
    return [
        {
            path: '/swaps',
            element: <SwapsGrid />,
        },
        {
            path: '/swaps/:sourceId',
            Component: SwapsGrid,
        },
        /*{
            path: '/swaps/:swaoId',
            Component: SwapView,
        },*/
    ];
}

export { swapsRoutes };
