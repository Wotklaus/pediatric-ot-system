import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PerfilPaciente.css";

function PerfilPaciente({ pacienteId }) {
  // Estados
  const [paciente, setPaciente] = useState(null);
  const [seguimientos, setSeguimientos] = useState([]);
  const [referencias, setReferencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del paciente y su seguimiento
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Aquí reemplaza por tus endpoints
        const pacienteRes = await fetch(`/api/pacientes/${pacienteId}`);
        const seguimientoRes = await fetch(`/api/pacientes/${pacienteId}/seguimientos`);
        const referenciaRes = await fetch(`/api/pacientes/${pacienteId}/referencias`);

        const pacienteData = await pacienteRes.json();
        const seguimientoData = await seguimientoRes.json();
        const referenciaData = await referenciaRes.json();

        setPaciente(pacienteData);
        setSeguimientos(seguimientoData);
        setReferencias(referenciaData);
      } catch (err) {
        // Manejo de error
        setPaciente(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pacienteId]);

  // Vista de carga
  if (loading) {
    return (
      <div className="perfil-paciente-main">
        <Sidebar />
        <div className="perfil-paciente-content">
          <p className="perfil-paciente-loading">Cargando datos del paciente...</p>
        </div>
      </div>
    );
  }

  // Vista principal
  return (
    <div className="perfil-paciente-main">
      <Sidebar />
      <div className="perfil-paciente-content">
        <div className="perfil-paciente-card">
          {/* DATOS DEL PACIENTE */}
          <section className="perfil-paciente-section">
            <h2>Ficha del Paciente</h2>
            <div className="perfil-paciente-row">
              <span className="perfil-paciente-label">Nombre:</span>
              <span className="perfil-paciente-value">{paciente?.nombre}</span>
            </div>
            <div className="perfil-paciente-row">
              <span className="perfil-paciente-label">Edad:</span>
              <span className="perfil-paciente-value">{paciente?.edad}</span>
            </div>
            <div className="perfil-paciente-row">
              <span className="perfil-paciente-label">Diagnóstico:</span>
              <span className="perfil-paciente-value">{paciente?.diagnostico}</span>
            </div>
            {/* Agrega más campos si lo necesitas */}
          </section>

          {/* SEGUIMIENTO */}
          <section className="perfil-paciente-section">
            <h2>Seguimiento</h2>
            {seguimientos.length === 0 ? (
              <p className="perfil-paciente-empty">No hay seguimientos registrados.</p>
            ) : (
              <ul className="perfil-paciente-seguimiento-list">
                {seguimientos.map((seg) => (
                  <li key={seg.id} className="perfil-paciente-seguimiento-item">
                    <span className="perfil-paciente-seg-fecha">{seg.fecha}</span>
                    <span className="perfil-paciente-seg-detalle">{seg.detalle}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* REFERENCIAS O NOTAS */}
          <section className="perfil-paciente-section">
            <h2>Referencias & Notas</h2>
            {referencias.length === 0 ? (
              <p className="perfil-paciente-empty">Sin referencias.</p>
            ) : (
              <ul className="perfil-paciente-referencia-list">
                {referencias.map((ref) => (
                  <li key={ref.id} className="perfil-paciente-referencia-item">
                    <span className="perfil-paciente-ref-fecha">{ref.fecha}</span>
                    <span className="perfil-paciente-ref-detalle">{ref.detalle}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default PerfilPaciente;