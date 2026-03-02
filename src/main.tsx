import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routerConfig } from '@/config/routerConfig';
import './config/configureMobX';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter(routerConfig);

root.render(
    <RouterProvider router={router} />
);