import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { useUser } from "../context/userContext";
import EvolucionEvaluacionesChart from "../components/EvolucionEvaluacionesChart";
import "./styles/Admin.css";

const Admin = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState("Usuario");
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

  const summaryCards = [
    { color: "primary", title: "Evaluaciones", value: 12, link: "#", linkText: "Ver detalles" },
    { color: "warning", title: "Pendientes", value: 3, link: "#", linkText: "Ver detalles" },
    { color: "success", title: "Completadas", value: 9, link: "#", linkText: "Ver detalles" },
    { color: "danger", title: "Alertas", value: 1, link: "#", linkText: "Ver detalles" }
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="container admin-container">
          <br />
          <h2>Bienvenido, {userName}</h2>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>

          {/* Tarjetas resumen */}
          <div className="row summary-row">
            {summaryCards.map((card, idx) => (
              <div className="col-xl-3 col-md-6 card-col" key={idx}>
                <div className={`card bg-${card.color} text-white mb-4`}>
                  <div className="card-body">
                    <span>{card.value}</span>
                    <br />
                    {card.title}
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <a className="small text-white stretched-link" href={card.link}>{card.linkText}</a>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="row graph-row">
            <div className="col-xl-6 card-col">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-chart-area me-1"></i>
                  Evolución de Evaluaciones
                </div>
                <div className="card-body">
                  <EvolucionEvaluacionesChart />
                </div>
              </div>
            </div>
            <div className="col-xl-6 card-col">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-chart-bar me-1"></i>
                  Estadísticas
                </div>
                <div className="card-body">
                  <div className="dummy-graph">
                    <span>Gráfico barras (Chart.js aquí)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de evaluaciones */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-table me-1"></i>
              Evaluaciones recientes
            </div>
            <div className="card-body">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Evaluación</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Carlos Pérez</td>
                    <td>Desarrollo Motor</td>
                    <td>2025-09-06</td>
                    <td>Completada</td>
                    <td>Normal</td>
                  </tr>
                  <tr>
                    <td>María Gómez</td>
                    <td>Alimentación</td>
                    <td>2025-09-05</td>
                    <td>Pendiente</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Juan Ruiz</td>
                    <td>Comunicación</td>
                    <td>2025-09-05</td>
                    <td>Completada</td>
                    <td>Atención urgente</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;