import React from "react";
import Sidebar from "../components/sidebar";

const Admin = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "250px", padding: "2rem" }}>
        <h1>Hola, soy Admin</h1>
        <p>¡Aquí puedes ver cómo luce tu Sidebar!</p>
      </div>
    </div>
  );
};

export default Admin;