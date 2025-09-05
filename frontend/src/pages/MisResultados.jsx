import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./styles/MisResultados.css";

const recomendacionesCasa = [
  "Fomente rutinas diarias que incluyan juego libre y estructurado.",
  "Dedique tiempo a actividades que estimulen la autonomía, como vestirse y alimentarse solo."
];

export default function MisResultados() {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/postgres/evaluaciones/mis-evaluaciones", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Evaluaciones recibidas por el frontend:", data);
        setEvaluaciones(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el historial de evaluaciones.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="error">Cargando historial de resultados...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!evaluaciones.length) return <p className="error">No hay evaluaciones realizadas.</p>;

  return (
    <>
      <Sidebar />
      <div className="resultados-main-content">
        <div className="resultados-container">
          <h2 className="resultados-titulo">Resultados de la Evaluación</h2>

          {evaluaciones.map((datos, idx) => (
            <div key={datos.id || idx} className="resultados-card">
              <div className="resultados-info">
                <p>
                  <strong>Puntaje Total:</strong>{" "}
                  <span className="puntaje">{datos.puntaje_total}</span>
                </p>
                <p>
                  <strong>Fecha de evaluación:</strong>{" "}
                  {datos.fecha
                    ? new Date(datos.fecha).toLocaleString("es-EC", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })
                    : ""}
                </p>
                {datos.id && (
                  <p>
                    <strong>ID de la evaluación:</strong>{" "}
                    <span className="id-evaluacion">{datos.id}</span>
                  </p>
                )}
              </div>
              <div className="resultados-recomendacion">
                <h3>Recomendación principal</h3>
                <p>{datos.recomendacion}</p>
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

          <div className="resultados-volver">
            <button
              className="resultados-volver-btn"
              onClick={() => navigate("/customer")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </>
  );
}