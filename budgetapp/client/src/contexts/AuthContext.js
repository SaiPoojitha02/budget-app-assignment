import React from "react";
export const AuthContext = new React.createContext({
  isLoggedIn: false,
  token: null,
});
