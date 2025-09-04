import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./styles/MisResultados.css";

const recomendacionesCasa = [
  "Fomente rutinas diarias que incluyan juego libre y estructurado.",
  "Dedique tiempo a actividades que estimulen la autonomía, como vestirse y alimentarse solo."
];

export default function MisResultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    puntajeTotal = 0,
    recomendacion = "Sin recomendación",
    // respuestas = [], // <-- Ya no se usa ni muestra
    fecha = "",
    evaluacionId // Puedes guardar y mostrar el id si lo tienes
  } = location.state || {};

  return (
    <>
      <Sidebar />
      <div className="resultados-main-content">
        <div className="resultados-container">
          <h2 className="resultados-titulo">Resultados de la Evaluación</h2>

          <div className="resultados-card">
            <div className="resultados-info">
              <p><strong>Puntaje Total:</strong> <span className="puntaje">{puntajeTotal}</span></p>
              <p><strong>Fecha de evaluación:</strong> {new Date(fecha).toLocaleString("es-EC", { dateStyle: 'medium', timeStyle: 'short' })}</p>
              {evaluacionId && (
                <p><strong>ID de la evaluación:</strong> <span className="id-evaluacion">{evaluacionId}</span></p>
              )}
            </div>
            <div className="resultados-recomendacion">
              <h3>Recomendación principal</h3>
              <p>{recomendacion}</p>
            </div>
            <div className="resultados-casa">
              <h4>¿Qué puede hacer en casa?</h4>
              <ul>
                {recomendacionesCasa.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="resultados-btn-group">
              <button className="resultados-btn" disabled>Agendar una cita</button>
              <button className="resultados-btn" disabled>Ponerse en contacto</button>
              <button className="resultados-btn" disabled>Solicitar realizar de nuevo la evaluación</button>
            </div>
          </div>

          <div className="resultados-volver">
            <button className="resultados-volver-btn" onClick={() => navigate("/customer")}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </>
  );
}