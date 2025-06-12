import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/app/layouts/MainLayout';
import Home from '@/app/pages/Home';
import LoginRegister from '@/app/pages/LoginRegister';
import Post from '@/app/pages/Post';
import Profile from '@/app/pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <LoginRegister /> },
      { path: 'post/:id', element: <Post /> },
      { path: 'profile/:id', element: <Profile /> },
    ],
  },
]);

export default router;
