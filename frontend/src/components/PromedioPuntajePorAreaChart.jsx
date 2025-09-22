import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "../pages/styles/DashboardCharts.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ENDPOINT = "http://localhost:5000/api/estadisticas/promedio-puntaje-area";

const COLORS = [
  "#007bff", // azul
  "#28a745", // verde
  "#ffc107", // amarillo
  "#dc3545", // rojo
  "#6f42c1", // morado
  "#17a2b8", // celeste
  "#fd7e14", // naranja
  "#20c997", // verde claro
  // Agrega más si tu API tiene más áreas
];

const PromedioPuntajePorAreaChart = () => {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ENDPOINT, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(r => r.json())
      .then(res => setChartData(res))
      .finally(() => setLoading(false));
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [{
      label: "Promedio Puntaje",
      data: chartData.values,
      backgroundColor: chartData.labels.map((_, i) => COLORS[i % COLORS.length])
    }]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  return (
    <div className={`${styles.chartCard} ${styles.bar}`}>
      <div className={styles.chartTitle}>
        <i className="fa fa-chart-bar" /> Promedio de puntaje por área en evaluaciones
      </div>
      <div className={styles.chartCanvas}>
        {loading ? <div>Cargando...</div> :
          <Bar data={data} options={options} />
        }
      </div>
    </div>
  );
};

export default PromedioPuntajePorAreaChart;