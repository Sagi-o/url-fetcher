import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './app/layouts/MainLayout';
import UrlContentPage from './app/pages/UrlContentPage';
import UrlListPage from './app/pages/UrlListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UrlListPage />,
      },
      {
        path: '/content',
        element: <UrlContentPage />,
      },
    ],
  },
]);
