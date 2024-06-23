import { Dashboard } from '@/pages/dashboard';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
