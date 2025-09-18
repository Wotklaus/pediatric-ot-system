import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  // Espera a que termine de cargar el usuario
  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;