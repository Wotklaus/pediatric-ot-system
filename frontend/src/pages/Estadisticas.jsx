import React from "react";
import Sidebar from "../components/sidebar";
import styles from "./styles/DashboardCharts.module.css";
import "./styles/Admin.css";

import EvolucionEvaluacionesChart from "../components/EvolucionEvaluacionesChart";
import LineEvaluacionesPorDiaChart from "../components/LineEvaluacionesPorDiaChart";
import PacientesPorMesChart from "../components/PacientesPorMesChart";
import EdadPacientesChart from "../components/EdadPacientesChart";
import PromedioPuntajePorAreaChart from "../components/PromedioPuntajePorAreaChart";
import DificultadesReportadasChart from "../components/DificultadesReportadasChart";

const Estadisticas = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="container admin-container">
          <h2>Estadísticas Generales</h2>
          <br />
          <div className={styles.chartsGrid} style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
            <EvolucionEvaluacionesChart />
            <LineEvaluacionesPorDiaChart />
            <PacientesPorMesChart />
            <EdadPacientesChart />
            <PromedioPuntajePorAreaChart />
            <DificultadesReportadasChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;