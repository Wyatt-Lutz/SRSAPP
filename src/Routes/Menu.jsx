import React from "react";
import { db, auth, app } from '../firebase.js';
import { useNavigate } from "react-router-dom";

export default function BasicSpeedDial() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [open, setOpen] = React.useState(false);
  function toggleDrawer() {
    setOpen(!open);
  }

  
  if (!user) {
    navigate('/');
  }





 
 
  



  return (
    <button onClick={onSignOut}>Sign out</button>
  );
}
