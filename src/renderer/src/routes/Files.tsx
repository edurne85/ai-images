import { RouteObject } from 'react-router-dom';
import { FilesGrid } from '../components/Grids';

function filesRoutes(): RouteObject[] {
    return [
        {
            path: '/files',
            element: <FilesGrid />,
        },
        {
            path: '/files/:folderId',
            Component: FilesGrid,
        },
        /*{
            path: '/file/:fileId',
            Component: FileView,
        },*/
    ];
}

export { filesRoutes };
