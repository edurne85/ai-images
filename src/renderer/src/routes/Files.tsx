import { RouteObject } from 'react-router-dom';
import { FilesGrid } from '../components/Grids';

function filesRoutes(): RouteObject[] {
    return [
        {
            path: '/files/:folderId?',
            element: <FilesGrid />,
        },
        /*{
            path: '/file/:fileId',
            Component: FileView,
        },*/
    ];
}

export { filesRoutes };
