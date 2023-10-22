import React, { useState } from "react";
import { auth, useNavigate, db } from '../imports.js';
import { signOut } from "firebase/auth";


export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const drawerButtonStyle = "text-white font-bold hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg transition duration-300";

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function signOutUser() {
    signOut(auth).then(() => {
      console.log('signout successful');
      document.cookie = "rememberMeToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      navigate('/');
    }).catch((error) => {
      console.error('signout failed: ' + error);
    });
    
  }





  return (
    <div >
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20"
          onClick={handleClick}
        />
      )}
    
      <div
        className={`rounded-lg transition-all border-gray-900 shadow-2xl duration-500 fixed left-0 top-1/2 mx-2 w-24 h-42 bg-gray-700 transform ${
          isOpen ? "-translate-y-12" : "translate-y-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-between space-y-3 p-2">
          <button onClick={() => navigate('/decks')} className={drawerButtonStyle}>Decks</button>
          <button onClick={() => navigate('/decks')} className={drawerButtonStyle}>Profile</button>
          <button onClick={signOutUser} className={drawerButtonStyle}>Sign Out</button>
        </div>
      </div>

      <button
        className={`absolute left-2 top-1/2 -translate-y-1/2 transition transform duration-500 px-5 ${
          isOpen && "-translate-y-28"
        }`}
        onClick={handleClick}
      >
        <svg
          width="58"
          height="58"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 6.9834C7.44772 6.9834 7 7.43111 7 7.9834C7 8.53568 7.44772 8.9834 8 8.9834H16C16.5523 8.9834 17 8.53568 17 7.9834C17 7.43111 16.5523 6.9834 16 6.9834H8Z"
            fill="currentColor"
          />
          <path
            d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z"
            fill="currentColor"
          />
          <path
            d="M8 15.017C7.44772 15.017 7 15.4647 7 16.017C7 16.5693 7.44772 17.017 8 17.017H16C16.5523 17.017 17 16.5693 17 16.017C17 15.4647 16.5523 15.017 16 15.017H8Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
            fill="currentColor"
          />
        </svg>
      </button>
      



    </div>
  );
}
