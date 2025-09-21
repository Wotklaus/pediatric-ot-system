import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import styles from "../pages/styles/DashboardCharts.module.css";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const LineEvaluacionesPorDiaChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Evaluaciones agregadas por día",
      data: [],
      borderColor: "#99a2acff",
      backgroundColor: "#babfc4ff",
      fill: false,
      tension: 0.2,
      pointRadius: 5,
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/postgres/evaluaciones/conteo-por-dia", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const resultado = Array.isArray(data)
          ? data
          : Array.isArray(data.conteo)
            ? data.conteo
            : Array.isArray(data.data)
              ? data.data
              : [];
        const fechas = resultado.map(e => e.fecha);
        const cantidades = resultado.map(e => e.cantidad);

        setChartData({
          labels: fechas,
          datasets: [{
            label: "Evaluaciones agregadas por día",
            data: cantidades,
            borderColor: "#76ace9ff",
            backgroundColor: "#68b5f4ff",
            fill: false,
            tension: 0.2,
            pointRadius: 5,
          }]
        });
        setLoading(false);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { title: { display: false } },
      y: { title: { display: false }, beginAtZero: true }
    }
  };

  return (
    <div className={`${styles.chartCard} ${styles.line}`}>
      <div className={styles.chartTitle}>
        <i className="fa fa-chart-line" /> Evaluaciones agregadas por día
      </div>
      <div className={styles.chartCanvas}>
        {loading ? <div>Cargando...</div> :
          <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default LineEvaluacionesPorDiaChart;