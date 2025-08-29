import React, { createContext, useState, useContext } from "react";

// Creamos el contexto
const userContext = createContext();

// Provider que envuelve toda la app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = no logueado

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useUser = () => useContext(userContext);
