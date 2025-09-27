import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PerfilPaciente.css";

// Formatea la fecha a DD/MM/YYYY
function formatearFecha(fechaIso) {
  if (!fechaIso) return "";
  const fecha = new Date(fechaIso);
  if (isNaN(fecha.getTime())) return "";
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

const recomendacionesCasa = [
  "Fomente rutinas diarias que incluyan juego libre y estructurado.",
  "Dedique tiempo a actividades que estimulen la autonomía, como vestirse y alimentarse solo."
];

export default function ReporteEvaluaciones() {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/reportes/reporte-evaluaciones", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setReporte(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar los datos.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="error">Cargando datos...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!reporte.length) return <p className="error">No hay reportes encontrados.</p>;

  return (
    <>
      <Sidebar />
      <div className="perfil-paciente-content">
        <h2>Perfil del Niño</h2>
        <div className="perfil-paciente-list">
          {reporte.map((item, idx) => (
            <div key={idx} className="perfil-paciente-card">
              {/* DATOS DEL PACIENTE */}
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">Nombre:</span>
                <span className="perfil-paciente-value">{item.nombreNino}</span>
              </div>
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">Fecha de</span>
               
              </div>
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">nacimiento:</span>
                <span className="perfil-paciente-value">{formatearFecha(item.fechaNacimiento)}</span>
              </div>
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">Sexo:</span>
                <span className="perfil-paciente-value">{item.sexo}</span>
              </div>
              {/* RESULTADO DE LA EVALUACIÓN */}
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">Puntaje:</span>
                <span className="perfil-paciente-value">{item.puntaje}</span>
              </div>
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">Fecha evaluación:</span>
                <span className="perfil-paciente-value">
                  {item.fechaEvaluacion
                    ? new Date(item.fechaEvaluacion).toLocaleString("es-EC", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })
                    : ""}
                </span>
              </div>
              <div className="perfil-paciente-row">
                <span className="perfil-paciente-label">Observaciones:</span>
                <span className="perfil-paciente-value">{item.recomendacion}</span>
              </div>
              <div className="perfil-paciente-row">
                <strong>¿Qué puede hacer en casa?</strong>
                <ul>
                  {recomendacionesCasa.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
              <div className="resultados-btn-group">
                <button className="resultados-btn" disabled>
                  Agendar una cita
                </button>
                <button className="resultados-btn" disabled>
                  Ponerse en contacto
                </button>
                <button className="resultados-btn" disabled>
                  Solicitar realizar de nuevo la evaluación
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}