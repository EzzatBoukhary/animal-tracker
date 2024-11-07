import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TestPage from './pages/TestPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />, // Redirect root to /auth
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },

  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />, // Redirect unknown routes to /auth
  },
]);

export default router;
