import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "../pages/styles/DashboardCharts.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ENDPOINT = "http://localhost:5000/api/estadisticas/pacientes-por-mes";

const PacientesPorMesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Pacientes",
      data: [],
      backgroundColor: "#007bff"
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ENDPOINT, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(r => r.json())
      .then(res => {
        setChartData({
          labels: res.labels,
          datasets: [{
            label: "Pacientes",
            data: res.values,
            backgroundColor: "#007bff"
          }]
        });
        setLoading(false);
      });
  }, []);

  const options = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      // Limita el ancho máximo de la barra
      maxBarThickness: 10
    }
  }
};

  return (
    <div className={`${styles.chartCard} ${styles.bar}`}>
      <div className={styles.chartTitle}>
        <i className="fa fa-chart-bar" /> Pacientes registrados por mes/año
      </div>
      <div className={styles.chartCanvas}>
        {loading ? <div>Cargando...</div> :
          <Bar data={chartData} options={options} />
        }
      </div>
    </div>
  );
};

export default PacientesPorMesChart;