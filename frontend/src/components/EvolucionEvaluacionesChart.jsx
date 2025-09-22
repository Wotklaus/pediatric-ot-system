import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "../pages/styles/DashboardCharts.module.css";
Chart.register(ArcElement, Tooltip, Legend);

const colores = {
  "No se recomienda atención": "#43a047",
  "Se recomienda atención": "#ffc107",
  "Atención urgente": "#d32f2f"
};

const EvolucionEvaluacionesChart = () => {
  const [datos, setDatos] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/postgres/evaluaciones/resumen-recomendacion", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setDatos([
          data["No se recomienda atención"] || 0,
          data["Se recomienda atención"] || 0,
          data["Atención urgente"] || 0
        ]);
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: [
      "No se recomienda atención",
      "Se recomienda atención",
      "Atención urgente"
    ],
    datasets: [
      {
        data: datos,
        backgroundColor: [
          colores["No se recomienda atención"],
          colores["Se recomienda atención"],
          colores["Atención urgente"]
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    cutout: "65%",
  };

  return (
    <div className={`${styles.chartCard} ${styles.donut}`}>
      <div className={styles.chartTitle}>
        <i className="fa fa-chart-pie" /> Evolución de Evaluaciones
      </div>
      <div className={styles.donutChartLayout}>
        <div className={styles.donutChartCanvas}>
          {loading ? <div>Cargando...</div> :
            <Doughnut data={chartData} options={options} width={220} height={220} />
          }
        </div>
        <div className={styles.donutChartLegend}>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{background: colores["No se recomienda atención"]}} /> No se recomienda atención
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{background: colores["Se recomienda atención"]}} /> Se recomienda atención
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{background: colores["Atención urgente"]}} /> Atención urgente
          </span>
        </div>
      </div>
    </div>
  );
};

export default EvolucionEvaluacionesChart;