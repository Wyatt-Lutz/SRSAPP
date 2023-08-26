import { Outlet } from 'react-router-dom';
import Drawers from './components/Drawer.jsx'

export default function Layout() {
  return (
    <div>
      <Drawers />
      <Outlet /> 
    </div>
  );
}