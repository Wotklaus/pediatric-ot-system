import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./styles/ResultadosEvaluacion.css";

const ENDPOINT = "http://localhost:5000/api/postgres/evaluaciones/admin-evaluaciones"; // <--- nuevo endpoint

const headers = [
  "ID",
  "Nombre del niño",
  "Puntaje Total",
  "Fecha de evaluación",
  "Recomendación"
];

const ResultadosEvaluacion = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLista();
    // eslint-disable-next-line
  }, []);

  const fetchLista = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(ENDPOINT, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => { });
          let errMsg = errData?.error ? errData.error : `Error HTTP ${res.status}`;
          setError(errMsg);
          setEvaluaciones([]);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEvaluaciones(data);
          setError("");
        } else {
          setEvaluaciones([]);
          setError("No se obtuvo la lista esperada.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor.");
        setLoading(false);
      });
  };

  // Ver detalle de evaluación
  const irADetalle = (id) => {
    navigate(`/detalleevaluacion/${id}`); // <--- Ajusta la ruta según tu app
  };

  // --- REPORTE CSV ---
  const generarReporteCSV = () => {
    if (!evaluaciones.length) return;
    const rows = evaluaciones.map(ev => [
      ev.id,
      `"${ev.nombre_nino}"`, // <--- usa nombre_nino
      ev.puntajeTotal,
      ev.fecha
        ? new Date(ev.fecha).toLocaleString("es-EC", {
          dateStyle: "medium",
          timeStyle: "short"
        })
        : "",
      `"${ev.recomendacion}"`
    ]);
    let csvContent =
      headers.join(",") + "\n" +
      rows.map(r => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_evaluaciones_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- REPORTE PDF ---
  const generarReportePDF = () => {
    if (!evaluaciones.length) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Evaluaciones", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: evaluaciones.map(ev => [
        ev.id,
        ev.nombre_nino, // <--- usa nombre_nino
        ev.puntajeTotal,
        ev.fecha
          ? new Date(ev.fecha).toLocaleString("es-EC", {
            dateStyle: "medium",
            timeStyle: "short"
          })
          : "",
        ev.recomendacion
      ]),
      styles: { fontSize: 10 },
      theme: "striped",
      margin: { left: 14, right: 14 },
    });
    doc.save(`reporte_evaluaciones_${new Date().toISOString().substring(0, 10)}.pdf`);
  };

  return (
    <div className="resultadosevaluacion-layout">
      <Sidebar />
      <div className="resultadosevaluacion-content container">
        <h2 className="mt-4">Resultados de Evaluaciones</h2>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="/admin">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Evaluaciones</li>
        </ol>
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-clipboard-list me-1"></i>
            Tabla de Evaluaciones
          </div>
          <div className="card-body">
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                      <th style={{ textAlign: "center" }}>Ver detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluaciones.length === 0 ? (
                      <tr>
                        <td colSpan={headers.length + 1} style={{ textAlign: "center" }}>
                          No hay evaluaciones registradas.
                        </td>
                      </tr>
                    ) : (
                      evaluaciones.map((ev) => (
                        <tr key={ev.id}>
                          <td>{ev.id}</td>
                          <td>{ev.nombre_nino}</td>
                          <td>{ev.puntajeTotal}</td>
                          <td>
                            {ev.fecha
                              ? new Date(ev.fecha).toLocaleString("es-EC", {
                                dateStyle: "medium",
                                timeStyle: "short"
                              })
                              : ""}
                          </td>
                          <td>{ev.recomendacion}</td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => irADetalle(ev.id)}
                              title="Ver detalle"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Botones para generar reporte CSV y PDF */}
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                  <button
                    className="btn btn-warning me-2"
                    onClick={generarReporteCSV}
                    disabled={evaluaciones.length === 0}
                  >
                    <FontAwesomeIcon icon={faFileDownload} /> Generar reporte CSV
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={generarReportePDF}
                    disabled={evaluaciones.length === 0}
                  >
                    <FontAwesomeIcon icon={faFilePdf} /> Generar reporte PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosEvaluacion;