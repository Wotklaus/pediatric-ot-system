import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import EvolucionEvaluacionesChart from "../components/EvolucionEvaluacionesChart";
import LineEvaluacionesPorDiaChart from "../components/LineEvaluacionesPorDiaChart";
import "./styles/Encargado.css";
import styles from "./styles/DashboardCharts.module.css"; // Usa el mismo grid que admin

const dashboardCards = [
  {
    icon: "fas fa-users",
    title: "Gestión de  Representantes",
    color: "#3e567dff",
    bg: "#e9ebefff",
    to: "/clientes",
    
  },
  {
    icon: "fas fa-child",
    title: "Gestión de Pacientes",
    color: "#15b67f",
    bg: "#e9fef8ff",
    to: "/pacientes",
    
  },
  {
    icon: "fas fa-file-alt",
    title: "Historias Clínicas",
    color: "#f8bf2f",
    bg: "#fff7df",
    to: "/historiasclinicas",
    
  },
  {
    icon: "fas fa-chart-bar",
    title: "Reportes",
    color: "#d54141",
    bg: "#ffeaea",
    to: "/resultadosEvaluacion",
   
  },
];

const Encargado = () => {
  const navigate = useNavigate();

  return (
    <div className="encargado-layout">
      <Sidebar />
      <div className="encargado-content">
        <h2>Bienvenido </h2>
        <br />
        

        {/* Cards superiores personalizados */}
        <div className="encargado-dashboard">
          {dashboardCards.map((card, idx) => (
            <div
              className="encargado-card"
              key={idx}
              style={{
                background: card.bg,
                color: card.color,
                borderColor: card.color,
                boxShadow: `0 3px 16px ${card.color}22`,
              }}
              onClick={() => navigate(card.to)}
            >
              <div className="encargado-card-icon" style={{ color: card.color }}>
                <i className={card.icon}></i>
              </div>
              <div className="encargado-card-title">{card.title}</div>
              <div className="encargado-card-description">{card.description}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          <div className="encargado-chart-card">
            <EvolucionEvaluacionesChart />
          </div>
          <div className="encargado-chart-card">
            <LineEvaluacionesPorDiaChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encargado;