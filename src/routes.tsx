import Game from './pages/Game';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Candy Crush',
    path: '/',
    element: <Game />
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
    element: <Leaderboard />,
    visible: false
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <Admin />,
    visible: false
  }
];

export default routes;