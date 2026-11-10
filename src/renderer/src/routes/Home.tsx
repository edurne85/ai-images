import { RouteObject } from 'react-router-dom';
import { TemplateHome } from '../components/TemplateHome';

function homeRoutes(): RouteObject[] {
    return [
        {
            path: '/',
            element: <TemplateHome />,
        },
    ];
}

export { homeRoutes };
