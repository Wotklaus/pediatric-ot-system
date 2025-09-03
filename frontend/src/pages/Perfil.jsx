import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./styles/Perfil.css";

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
    try {
      await api.put(`/api/pg/usuarios`, formulario, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setUsuario(formulario);
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

  if (!usuario) return <p>⏳ Cargando datos de usuario...</p>;

  return (
    <div className="customer-layout">
      <Sidebar />
      <div className="customer-content">
        {mensaje && <div className={`mensaje-toast ${tipoMensaje}`}>{mensaje}</div>}
        <div className="perfil-container">
          <div
            className="perfil-icon"
            onClick={() => document.getElementById("fotoInput").click()}
          >
            {usuario.foto ? <img src={usuario.foto} alt="Usuario" /> : "🧑‍💼"}
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
          <div className="perfil-info">
            {["nombre", "apellido", "cedula", "telefono", "email"].map((campo) => (
              <div className="perfil-row" key={campo}>
                <label>{campo.toUpperCase()}:</label>
                {editando ? (
                  <input
                    type="text"
                    name={campo}
                    value={formulario[campo] || ""}
                    onChange={handleChange}
                    disabled={campo === "email" || campo === "cedula"}
                  />
                ) : (
                  <span>{usuario[campo]}</span>
                )}
              </div>
            ))}
            {editando ? (
              <div className="perfil-buttons">
                <button className="guardar" onClick={handleUpdate}>
                  Guardar
                </button>
                <button
                  className="cancelar"
                  onClick={() => {
                    setFormulario(usuario);
                    setEditando(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button className="editar" onClick={() => setEditando(true)}>
                Actualizar Información
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;