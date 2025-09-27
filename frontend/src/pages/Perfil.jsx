import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Swal from "sweetalert2";
import "./styles/Perfil.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [metrics, setMetrics] = useState({ formulariosCompletados: 0 });
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUsuarioYEvaluacion = async () => {
      try {
        // 1. Consulta usuario (AJUSTA el endpoint si es distinto)
        const res = await api.get(`/api/pg/usuarios/${localStorage.getItem("email")}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
        setFormulario(res.data);
        setMetrics({
          formulariosCompletados: res.data.formulariosCompletados ?? 0,
        });

        // 2. Saca el id del formulario del usuario (AJUSTA el campo si es necesario)
        // Si tienes dudas, haz console.log(res.data) y busca el campo que es el id del formulario
        const formularioId = res.data.formularioId || res.data.id_formulario || res.data.id;

        // 3. Consulta si existe evaluación para ese formulario
        let evaluacionCompletada = false;
        if (formularioId) {
          try {
            const evRes = await api.get(`/api/postgres/evaluaciones/by-formulario/${formularioId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            // Si existe el campo id en la respuesta, la evaluación está hecha
            if (evRes.data && evRes.data.id) {
              evaluacionCompletada = true;
            }
          } catch (e) {
            // Si no existe, sigue en registro
            evaluacionCompletada = false;
          }
        }

        // SOLO nos interesa hasta evaluación, control lo dejamos para después
        setUsuario(prev => ({
          ...prev,
          evaluacionCompletada
        }));
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      }
    };
    fetchUsuarioYEvaluacion();
  }, [navigate]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const datos = {
      nombre: formulario.nombre || null,
      apellido: formulario.apellido || null,
      cedula: formulario.cedula || null,
      telefono: formulario.telefono || null,
    };

    try {
      await api.put(`/api/pg/usuarios`, datos, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setUsuario({ ...usuario, ...datos });
      setEditando(false);
      Swal.fire({
        title: "Perfil actualizado correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1800,
        background: "#f5f5f5",
        color: "#333"
      });
    } catch (error) {
      Swal.fire({
        title: "❌ Error al actualizar perfil",
        icon: "error",
        showConfirmButton: false,
        timer: 1800,
        background: "#f5f5f5",
        color: "#a82822"
      });
    }
  };

  const handleCancel = () => {
    setFormulario(usuario);
    setEditando(false);
    Swal.fire({
      title: "Edición cancelada",
      icon: "info",
      showConfirmButton: false,
      timer: 1200,
      background: "#f5f5f5",
      color: "#333"
    });
  };

  if (!usuario) return (
    <div className="perfil-elegante-main">
      <Sidebar />
      <div className="perfil-elegante-content">
        <p className="perfil-elegante-loading">⏳ Cargando datos de usuario...</p>
      </div>
    </div>
  );

  // PROGRESO SOLO HASTA EVALUACIÓN
  const etapas = ["Registro", "Evaluación", "Control"];
  let etapaIndex = 0;
  if (usuario.evaluacionCompletada) etapaIndex = 1;
  // NO se avanza a control
  const progreso = ((etapaIndex + 1) / etapas.length) * 100;
  const getEtapaClass = idx => etapaIndex === idx ? "etapa-activa" : "";

  return (
    <div className="perfil-elegante-main">
      <Sidebar />
      <div className="perfil-elegante-content">
        <div className="perfil-elegante-card perfil-elegante-row-flex">
          <div className="perfil-elegante-avatar-profesional">
            <FaUserCircle size={120} color="#444" />
          </div>
          <div className="perfil-elegante-info-col">
            <h2 className="perfil-elegante-title">Mi Perfil</h2>
            <div className="perfil-elegante-grid-datos">
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Nombre:</label>
                {editando ? (
                  <input className="perfil-elegante-input" type="text" name="nombre" value={formulario.nombre || ""} onChange={handleChange} />
                ) : (
                  <span className="perfil-elegante-value">{usuario.nombre}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Apellido:</label>
                {editando ? (
                  <input className="perfil-elegante-input" type="text" name="apellido" value={formulario.apellido || ""} onChange={handleChange} />
                ) : (
                  <span className="perfil-elegante-value">{usuario.apellido}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Cédula:</label>
                {editando ? (
                  <input className="perfil-elegante-input" type="text" name="cedula" value={formulario.cedula || ""} onChange={handleChange} disabled />
                ) : (
                  <span className="perfil-elegante-value">{usuario.cedula}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Teléfono:</label>
                {editando ? (
                  <input className="perfil-elegante-input" type="text" name="telefono" value={formulario.telefono || ""} onChange={handleChange} />
                ) : (
                  <span className="perfil-elegante-value">{usuario.telefono}</span>
                )}
              </div>
              <div className="perfil-elegante-row">
                <label className="perfil-elegante-label">Email:</label>
                {editando ? (
                  <input className="perfil-elegante-input" type="text" name="email" value={formulario.email || ""} onChange={handleChange} disabled />
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
                  <button className="perfil-elegante-btn cancelar" onClick={handleCancel}>
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
        {/* Barra de progreso SOLO hasta evaluación */}
        <div className="perfil-progress-card">
          <div className="perfil-progress-etapas-bar">
            <span className={`perfil-etapa-label ${getEtapaClass(0)}`}>Registro</span>
            <span className={`perfil-etapa-label ${getEtapaClass(1)}`}>Evaluación</span>
            <span className={`perfil-etapa-label`}>Control</span>
          </div>
          <div className="perfil-progress-bar">
            <div className={`perfil-progress-filled etapa-${etapaIndex}`} style={{ width: `${progreso}%` }} />
            <div className="perfil-progress-dot" style={{ left: `0%` }} />
            <div className="perfil-progress-dot" style={{ left: `50%` }} />
            <div className="perfil-progress-dot" style={{ left: `100%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;