import { createBrowserRouter } from 'react-router-dom';
import App from './app/app';
import UrlContentPage from './app/pages/UrlContentPage';
import UrlListPage from './app/pages/UrlListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <UrlListPage />,
      },
      {
        path: '/content',
        element: <UrlContentPage />,
      },
    ],
  },
]);
