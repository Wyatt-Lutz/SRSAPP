import { Outlet } from 'react-router-dom';
import Drawers from './components/Drawer.jsx'

export default function Layout() {
  return (
    <div>
      Hello
      <Drawers />
      <Outlet /> 
    </div>
  );
}