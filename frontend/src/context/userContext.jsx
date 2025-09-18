import React, { createContext, useState, useContext, useEffect } from "react";

const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const nombre = localStorage.getItem("nombre");
    const token = localStorage.getItem("token");
    const rol_id = localStorage.getItem("rol_id");

    if (token && email && nombre && rol_id) {
      let role;
      if (parseInt(rol_id) === 1) role = "admin";
      else if (parseInt(rol_id) === 2) role = "cliente";
      else if (parseInt(rol_id) === 3) role = "encargado";
      else role = "cliente";

      setUser({ nombre, email, role, token });
    }
    setLoading(false);
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);