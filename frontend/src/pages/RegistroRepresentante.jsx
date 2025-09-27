import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./styles/RegistroRepresentante.css";
import api from "../api";
import Swal from "sweetalert2";

function RegistroRepresentante() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    email: "",
    contrasena: "",
  });

  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();

    const camposObligatorios = [
      { key: "nombre", label: "Nombre" },
      { key: "apellido", label: "Apellido" },
      { key: "cedula", label: "Cédula" },
      { key: "telefono", label: "Teléfono" },
      { key: "email", label: "Email" },
      { key: "contrasena", label: "Contraseña" },
    ];

    for (const campo of camposObligatorios) {
      if (!formulario[campo.key].trim()) {
        Swal.fire({
          icon: "warning",
          title: "Campo obligatorio",
          text: `El campo "${campo.label}" es obligatorio.`,
          timer: 2200,
          showConfirmButton: false
        });
        return;
      }
    }

    setCargando(true);

    try {
      const datosConRol = { ...formulario, rol_id: 2 };
      const resp = await api.post("/api/registro", datosConRol);

      const clienteId = resp.data?.id;

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "El representante ha sido registrado correctamente.",
        timer: 1800,
        showConfirmButton: false
      });

      setFormulario({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        email: "",
        contrasena: "",
      });

      if (clienteId) {
        setTimeout(() => {
          navigate("/formulario", { state: { clienteId } });
        }, 1800);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error
          ? error.response.data.error
          : "❌ Error inesperado.",
        timer: 2400,
        showConfirmButton: true
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="rr-layout">
      <Sidebar />
      <div className="rr-content">
        <div className="rr-container">
          <h2>Registro de Representante</h2>
          <form onSubmit={manejarRegistro}>
            <div className="rr-form-grid">
              <div className="rr-input-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
              <div className="rr-input-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formulario.apellido}
                  onChange={handleChange}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
              <div className="rr-input-group">
                <label>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formulario.cedula}
                  onChange={handleChange}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
              <div className="rr-input-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={handleChange}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
              <div className="rr-input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={handleChange}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
              <div className="rr-input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  value={formulario.contrasena}
                  onChange={handleChange}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
            </div>
            <button type="submit" className="rr-btn" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrar representante"}
            </button>
          </form>
          <div className="rr-volver">
            <button className="rr-volver-btn" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroRepresentante;