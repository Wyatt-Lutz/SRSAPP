import { Outlet, useLocation } from 'react-router-dom';
import Drawers from './components/Drawer.jsx'

export default function Layout() {
  const location = useLocation();
  const drawerRoutes = [  
    '/settings',
    '/cards',
    '/decks',
    '/decks/create',
    '/decks/study',
    '/decks/edit'
  ]
  const drawerPages = drawerRoutes.includes(location.pathname);
  return (
    <div>
      {drawerPages && <Drawers />}

      <Outlet /> 
    </div>
  );
}