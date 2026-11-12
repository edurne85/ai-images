import { createHashRouter, RouterProvider } from 'react-router-dom';
import { getRoutes } from './routes';
import { DbContext, DbProvider } from './providers/DbProvider/DbProvider';

const dbProvider = new DbProvider();
function App(): React.JSX.Element {
    const routes = getRoutes();
    const router = createHashRouter(routes);
    return (
        <DbContext value={dbProvider}>
            <RouterProvider router={router} />
        </DbContext>
    );
}

export default App;
