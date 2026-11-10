import { createHashRouter, RouterProvider } from 'react-router-dom';
import { getRoutes } from './routes';

function App(): React.JSX.Element {
    const routes = getRoutes();
    const router = createHashRouter(routes);
    return <RouterProvider router={router} />;
}

export default App;
