import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './app/layouts/MainLayout';
import UrlContentPage from './app/pages/content/UrlContentPage';
import UrlListPage from './app/pages/list/UrlListPage';

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
