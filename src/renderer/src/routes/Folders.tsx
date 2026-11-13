import { RouteObject } from 'react-router-dom';
import { FoldersGrid } from '../components/Grids';

function foldersRoutes(): RouteObject[] {
    return [
        {
            path: '/folders',
            element: <FoldersGrid />,
        },
    ];
}

export { foldersRoutes };
