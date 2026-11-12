import { RouteObject } from 'react-router-dom';
import { TemplateHome } from '@renderer/components/TemplateHome';

function homeRoutes(): RouteObject[] {
    return [
        {
            path: '/',
            element: <TemplateHome />,
        },
    ];
}

export { homeRoutes };
