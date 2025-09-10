import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./styles/Perfil.css";

function MinimalUserIcon() {
  return (
    <svg
      width="86"
      height="86"
      viewBox="0 0 86 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="perfil-elegante-svg-icon"
    >
      <circle cx="43" cy="43" r="42" fill="#e3f0ff" stroke="#2264a8" strokeWidth="2" />
      <circle cx="43" cy="36" r="18" fill="#2264a8" opacity="0.18" />
      <ellipse cx="43" cy="60" rx="21" ry="12" fill="#2264a8" opacity="0.11" />
      <circle cx="43" cy="36" r="12" fill="#2264a8" />
      <ellipse cx="43" cy="60" rx="14" ry="8" fill="#2264a8" />
    </svg>
  );
}

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUsuario = async () => {
      try {
        const res = await api.get(`/api/pg/usuarios/${localStorage.getItem("email")}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
        setFormulario(res.data);
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      }
    };
    fetchUsuario();
  }, [navigate]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // Solo los campos que el backend acepta actualizar en perfil
    const datos = {
      nombre: formulario.nombre || null,
      apellido: formulario.apellido || null,
      cedula: formulario.cedula || null,
      telefono: formulario.telefono || null,
      // Si quieres permitir foto y tu backend la soporta, agrega aquí
      // foto: formulario.foto || null
    };

    try {
      await api.put(`/api/pg/usuarios`, datos, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setUsuario({ ...usuario, ...datos });
      setEditando(false);
      setTipoMensaje("success");
      setMensaje("✅ Perfil actualizado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setTipoMensaje("error");
      setMensaje("❌ Error al actualizar perfil");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  if (!usuario) return (
    <div className="perfil-elegante-main">
      <Sidebar />
      <div className="perfil-elegante-content">
        <p className="perfil-elegante-loading">⏳ Cargando datos de usuario...</p>
      </div>
    </div>
  );

  return (
    <div className="perfil-elegante-main">
      <Sidebar />
      <div className="perfil-elegante-content">
        {mensaje && <div className={`perfil-elegante-toast ${tipoMensaje}`}>{mensaje}</div>}
        <div className="perfil-elegante-card perfil-elegante-row-flex">
          <div
            className="perfil-elegante-avatar-col"
            onClick={() => document.getElementById("fotoInput").click()}
            title="Cambiar foto de perfil"
          >
            {usuario.foto ? (
              <img src={usuario.foto} alt="Usuario" className="perfil-elegante-avatar-img" />
            ) : (
              <MinimalUserIcon />
            )}
            <input
              type="file"
              id="fotoInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () =>
                    setUsuario({ ...usuario, foto: reader.result });
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="perfil-elegante-info-col">
            <h2 className="perfil-elegante-title">Mi Perfil</h2>
            <div className="perfil-elegante-data-col">
              {/* Datos en una sola columna, tipo ficha */}
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Nombre:</label>
                {editando ? (
                  <input
                    className="perfil-elegante-input"
                    type="text"
                    name="nombre"
                    value={formulario.nombre || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="perfil-elegante-value">{usuario.nombre}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Apellido:</label>
                {editando ? (
                  <input
                    className="perfil-elegante-input"
                    type="text"
                    name="apellido"
                    value={formulario.apellido || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="perfil-elegante-value">{usuario.apellido}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Cédula:</label>
                {editando ? (
                  <input
                    className="perfil-elegante-input"
                    type="text"
                    name="cedula"
                    value={formulario.cedula || ""}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <span className="perfil-elegante-value">{usuario.cedula}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Teléfono:</label>
                {editando ? (
                  <input
                    className="perfil-elegante-input"
                    type="text"
                    name="telefono"
                    value={formulario.telefono || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="perfil-elegante-value">{usuario.telefono}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Email:</label>
                {editando ? (
                  <input
                    className="perfil-elegante-input"
                    type="text"
                    name="email"
                    value={formulario.email || ""}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <span className="perfil-elegante-value">{usuario.email}</span>
                )}
              </div>
            </div>
            <div className="perfil-elegante-btn-group">
              {editando ? (
                <>
                  <button className="perfil-elegante-btn guardar" onClick={handleUpdate}>
                    Guardar
                  </button>
                  <button
                    className="perfil-elegante-btn cancelar"
                    onClick={() => {
                      setFormulario(usuario);
                      setEditando(false);
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="perfil-elegante-btn editar" onClick={() => setEditando(true)}>
                  Actualizar Información
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;