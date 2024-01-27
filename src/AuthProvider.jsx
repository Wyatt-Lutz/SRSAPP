
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, auth } from "./imports.js";

const UserContext = createContext({loggedIn: false, currUser: null})

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const excludedRoutes = ["/", "/signup"];
  const [user, setUser] = useState({loggedIn: false})

  function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (authUser) => {
      if(authUser) {
        callback({loggedIn: true, currUser: auth.currentUser });
      } else {
        callback({loggedIn: false})
      }
    })
  }

  useEffect(() => {
    if (!excludedRoutes.includes(location.pathname)) {
      const unsubscribe = onAuthStateChange(setUser);
      if (!user.loggedIn) {
        console.info('user is not authenticated');
      }


      return () => {
        unsubscribe();
      };
    }
  }, []);


  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
