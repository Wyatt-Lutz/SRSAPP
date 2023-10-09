
import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, auth } from "./imports.js";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const excludedRoutes = ["/", "/signup"];

  useEffect(() => {
    if (!excludedRoutes.includes(location.pathname)) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          console.log("user is not authenticated");
          navigate('/');
        } else {
          console.log("user is authenticated");
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, []);

  return <>{children}</>;
};
