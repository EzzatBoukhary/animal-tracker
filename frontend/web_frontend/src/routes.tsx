import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TestPage from './pages/TestPage';
import CreatePost from './pages/CreatePostPage';
import HomePage from './pages/HomePage';
import ListViewPage from './pages/ListViewPage';
import Profile from './components/Profile';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/MapPage';

const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/auth" replace />, // Redirect unknown routes to /auth
  },

  {
    path: "/auth",
    element: <AuthPage />
  },

  {
    path:"/post",
    element: <CreatePost />
  },
  {
    path:"/home",
    element: <HomePage />
  },
  {
    path:"/list",
    element: <ListViewPage />
  },
  {
    path:"/map",
    element: <MapPage />
  },
  {
    path:"/profile",
    element: <ProfilePage />
  },

]);

export default router;