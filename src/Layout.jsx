import { Outlet, useLocation } from 'react-router-dom';
import Drawers from './components/Drawer.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

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
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}