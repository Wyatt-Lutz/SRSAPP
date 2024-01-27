
import React, { useEffect, createContext, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, auth } from "./imports.js";



export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const excludedRoutes = ["/", "/signup"];

  useEffect(() => {
    if (!excludedRoutes.includes(location.pathname)) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.info("User is authenticated");
        } else {
          console.info("User is not authenticated, signing out");
          signOut(auth).then(() => {
            console.info('Sign out successful');
          }).catch((error) => {
            console.error(error);
          });
          navigate('/');
        }

      });
      return () => {
        unsubscribe();
      };
    }
  }, []);


  return (
    <div>{children}</div>
  );
};
