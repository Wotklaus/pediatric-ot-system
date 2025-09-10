import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PersonalMedico.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";   // <-- NUEVO

const ENDPOINT = "http://localhost:5000/api/formularios/vista";

const headers = [
  "ID",
  "Usuario",
  "Nombre del niño",
  "Edad",
  "Sexo",
  "Fecha de nacimiento",
  "Cuidador principal",
  "Parentesco",
  "Fecha de registro"
];

const FormulariosResultados = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();    // <-- NUEVO

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
          const errData = await res.json().catch(() => {});
          let errMsg = errData?.error ? errData.error : `Error HTTP ${res.status}`;
          setError(errMsg);
          setFormularios([]);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFormularios(data);
          setError("");
        } else {
          setFormularios([]);
          setError("No se obtuvo la lista esperada.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor.");
        setLoading(false);
      });
  };

  // NUEVO: función para navegar al detalle
  const irADetalle = (id) => {
    navigate(`/formulariodetalle/${id}`);
  };

  // --- GENERAR REPORTE CSV SOLO DE LA TABLA VISIBLE ---
  const generarReporteCSV = () => {
    if (!formularios.length) return;
    const rows = formularios.map(f => [
      f.id,
      `"${f.usuario}"`,
      `"${f.nombre_nino}"`,
      f.edad,
      f.sexo,
      f.fecha_nacimiento ? f.fecha_nacimiento.substring(0, 10) : "",
      `"${f.cuidador_principal}"`,
      `"${f.parentesco}"`,
      f.created_at ? f.created_at.substring(0, 10) : ""
    ]);
    let csvContent =
      headers.join(",") + "\n" +
      rows.map(r => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_formularios_${new Date().toISOString().substring(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- GENERAR REPORTE PDF SOLO DE LA TABLA VISIBLE ---
  const generarReportePDF = () => {
    if (!formularios.length) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Formularios", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: formularios.map(f => [
        f.id,
        f.usuario,
        f.nombre_nino,
        f.edad,
        f.sexo,
        f.fecha_nacimiento ? f.fecha_nacimiento.substring(0, 10) : "",
        f.cuidador_principal,
        f.parentesco,
        f.created_at ? f.created_at.substring(0, 10) : ""
      ]),
      styles: { fontSize: 10 },
      theme: "striped",
      margin: { left: 14, right: 14 },
    });
    doc.save(`reporte_formularios_${new Date().toISOString().substring(0,10)}.pdf`);
  };

  return (
    <div className="personalmedico-layout">
      <Sidebar />
      <div className="personalmedico-content container">
        <h2 className="mt-4">Resultados de Formularios</h2>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="/admin">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Formularios</li>
        </ol>
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-clipboard-list me-1"></i>
            Tabla de Formularios
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
                      <th style={{ textAlign: "center" }}>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formularios.length === 0 ? (
                      <tr>
                        <td colSpan={headers.length + 1} style={{ textAlign: "center" }}>
                          No hay formularios registrados.
                        </td>
                      </tr>
                    ) : (
                      formularios.map((f) => (
                        <tr key={f.id}>
                          <td>{f.id}</td>
                          <td>{f.usuario}</td>
                          <td>{f.nombre_nino}</td>
                          <td>{f.edad}</td>
                          <td>{f.sexo}</td>
                          <td>{f.fecha_nacimiento ? f.fecha_nacimiento.substring(0, 10) : ""}</td>
                          <td>{f.cuidador_principal}</td>
                          <td>{f.parentesco}</td>
                          <td>{f.created_at ? f.created_at.substring(0, 10) : ""}</td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => irADetalle(f.id)}
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
                    disabled={formularios.length === 0}
                  >
                    <FontAwesomeIcon icon={faFileDownload} /> Generar reporte CSV
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={generarReportePDF}
                    disabled={formularios.length === 0}
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

export default FormulariosResultados;