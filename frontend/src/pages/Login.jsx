import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./styles/Login.css";
import { useUser } from "../context/userContext"; // <-- Importar contexto

function Login() {
  const [credenciales, setCredenciales] = useState({ email: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const { setUser } = useUser(); // <-- Hook del contexto
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const respuesta = await api.post("/api/login", credenciales);
      const { usuario, token } = respuesta.data;

      console.log("LOGIN EXITOSO - Usuario:", usuario);
      console.log("LOGIN EXITOSO - TOKEN:", token ? "Existente" : "No existente");

      // Guardar en localStorage
      localStorage.setItem("email", usuario.email);
      localStorage.setItem("rol_id", usuario.rol_id.toString());
      localStorage.setItem("token", token || "");
      localStorage.setItem("nombre", usuario.nombre);

      // Traducción de rol_id a nombre de rol
      let role;
      if (usuario.rol_id === 1) role = "admin";        // ADMINISTRADOR
      else if (usuario.rol_id === 2) role = "cliente"; // CLIENTE
      else if (usuario.rol_id === 3) role = "encargado"; // ENCARGADO
      else role = "cliente"; // Por defecto

      // Actualizar contexto
      setUser({
        nombre: usuario.nombre,
        email: usuario.email,
        role,
        token: token || "",
      });

      setMensaje(`✅ Bienvenido, ${usuario.nombre} (rol: ${role})`);

      // Redirección según rol
      if (role === "admin") navigate("/admin");
      else if (role === "encargado") navigate("/encargado");
      else if (role === "cliente") navigate("/customer");
      else navigate("/home");

    } catch (error) {
      console.error("Error en login:", error.response?.data?.error || error.message);
      setMensaje("❌ Credenciales incorrectas o error de servidor");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={manejarLogin}>
          <div className="login-input-group">
            <label>Email</label>
            <input type="email" name="email" value={credenciales.email} onChange={handleChange} required />
          </div>
          <div className="login-input-group">
            <label>Contraseña</label>
            <input type="password" name="contrasena" value={credenciales.contrasena} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        {mensaje && <div style={{ color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</div>}
      </div>
    </div>
  );
}

export default Login;