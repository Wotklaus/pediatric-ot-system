import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { useUser } from "../context/userContext";
import EvolucionEvaluacionesChart from "../components/EvolucionEvaluacionesChart";
import LineEvaluacionesPorDiaChart from "../components/LineEvaluacionesPorDiaChart";
import styles from "./styles/DashboardCharts.module.css";
import "./styles/Admin.css";

const ENDPOINT_PERSONAL = "http://localhost:5000/api/pg/usuarios/personal-medico";

const Admin = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState("Usuario");
  const [personalMedicoCount, setPersonalMedicoCount] = useState(0);
  const [representantesCount, setRepresentantesCount] = useState(0);
  const [pacientesCount, setPacientesCount] = useState(0);
  const [evaluacionesCount, setEvaluacionesCount] = useState(0);

  // Estado para la tabla de personal médico
  const [personalMedico, setPersonalMedico] = useState([]);
  const [loadingPersonalMedico, setLoadingPersonalMedico] = useState(true);
  const [personalMedicoError, setPersonalMedicoError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("nombre");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Counts
    fetch("http://localhost:5000/api/pg/usuarios/personal-medico/count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(data => setPersonalMedicoCount(Number(data.count || 0)))
      .catch(() => setPersonalMedicoCount(0));

    fetch("http://localhost:5000/api/pg/usuarios/clientes/count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(data => setRepresentantesCount(Number(data.count || 0)))
      .catch(() => setRepresentantesCount(0));

    fetch("http://localhost:5000/api/formularios/pacientes/count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(data => setPacientesCount(Number(data.count || 0)))
      .catch(() => setPacientesCount(0));

    fetch("http://localhost:5000/api/postgres/evaluaciones/count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(data => setEvaluacionesCount(Number(data.count || 0)))
      .catch(() => setEvaluacionesCount(0));

    // Personal Médico para la tabla (solo 5 últimos)
    const token = localStorage.getItem("token");
    setLoadingPersonalMedico(true);
    setPersonalMedicoError("");
    fetch(ENDPOINT_PERSONAL, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error("No se obtuvo la lista esperada.");
        // Ordenar por id descendente (más reciente arriba)
        const sorted = [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        setPersonalMedico(sorted.slice(0, 5)); // Solo los 5 más recientes
        setPersonalMedicoError("");
      })
      .catch(e => {
        setPersonalMedico([]);
        setPersonalMedicoError(e?.message || "Error de conexión con el servidor.");
      })
      .finally(() => setLoadingPersonalMedico(false));
  }, []);

  // COLORES PERSONALIZADOS (puedes cambiarlos a placer)
  const summaryCards = [
    { color: "#3b5b7cff", title: "Personal Médico", value: personalMedicoCount, link: "/personalmedico", linkText: "Ver detalles" }, // Azul
    { color: "#f8bf2fff", title: "Representantes", value: representantesCount, link: "/clientes", linkText: "Ver detalles" },         // Amarillo
    { color: "#4cc152ff", title: "Pacientes", value: pacientesCount, link: "/pacientes", linkText: "Ver detalles" },                  // Verde
    { color: "#d54141ff", title: "Evaluaciones", value: evaluacionesCount, link: "/historiasclinicas", linkText: "Ver detalles" }     // Rojo
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="container admin-container">
          <h2>Bienvenido</h2>
          <br />
          {/* Tarjetas resumen */}
          <div className="row summary-row">
            {summaryCards.map((card, idx) => (
              <div className="col-xl-3 col-md-6 card-col" key={idx}>
                <div
                  className="card text-white mb-4"
                  style={{ backgroundColor: card.color }}
                >
                  <div className="card-body">
                    <span>{card.value}</span>
                    <br />
                    {card.title}
                  </div>
                  <div
                    className="card-footer d-flex align-items-center justify-content-between"
                    style={{ cursor: "pointer" }}
                    onClick={() => card.link !== "#" && navigate(card.link)}
                  >
                    <span className="small text-white stretched-link">{card.linkText}</span>
                    <div className="small text-white">
                      <i className="fas fa-angle-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráficos con mismo tamaño y distribución */}
          <div className={styles.chartsGrid}>
            <EvolucionEvaluacionesChart />
            <LineEvaluacionesPorDiaChart />
          </div>

          {/* Solo los últimos 5 personal médico */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-user-md me-1"></i>
              Personal Médico 
            </div>
            <div className="card-body">
              {loadingPersonalMedico ? (
                <div>Cargando...</div>
              ) : personalMedicoError ? (
                <div className="alert alert-danger">{personalMedicoError}</div>
              ) : (
                <table className="table table-striped table-bordered" id="personalMedicoTable">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Cédula</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalMedico.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          No hay personal médico registrado.
                        </td>
                      </tr>
                    ) : (
                      personalMedico.map((usuario) => (
                        <tr key={usuario.id ?? usuario.email}>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.apellido}</td>
                          <td>{usuario.cedula}</td>
                          <td>{usuario.telefono}</td>
                          <td>{usuario.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;