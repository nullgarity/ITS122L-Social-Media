import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Post from './pages/Post';
import Profile from './pages/Profile';
import MyLikes from './pages/MyLikes';
import Messenger from './pages/Messenger';
import EditProfile from './pages/EditProfile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Login /> },
      { path: '/login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'home', element: <Home /> },
      { path: 'post/:id', element: <Post /> },
      { path: 'profile/:id', element: <Profile /> },
      { path: 'my-likes', element: <MyLikes /> },
      { path: 'messenger', element: <Messenger /> },
      { path: 'edit-profile', element: <EditProfile /> },
    ],
  },
]);

export default router;
