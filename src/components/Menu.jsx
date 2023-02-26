import React from "react";
import { useNavigate } from "react-router-dom";
export default function BasicSpeedDial() {
  const [open, setOpen] = React.useState(false);
  function toggleDrawer() {
    setOpen(!open);
  }
  const cButtonStyle = {
    //  backgroundColor: '#dee0e3'
  };
  const boxStyle = {
    position: "relative",
    left: "44.5vw",
    bottom: "-90vh",
    width: "10vw",
  };
  var navigate = useNavigate();
  function toSettingsRoute() {
    navigate('/settings');
    
      
  }
  function toDecksRoute() {
    navigate('/decks');
  }



  return (
    <div>Hello</div>
  );
}
