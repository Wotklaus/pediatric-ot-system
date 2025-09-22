import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "../pages/styles/DashboardCharts.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ENDPOINT = "http://localhost:5000/api/estadisticas/distribucion-edad";

const EdadPacientesChart = () => {
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
      data: chartData.values,
      backgroundColor: ["#007bff", "#28a745", "#ffc107"]
    }]
  };

  return (
    <div className={`${styles.chartCard} ${styles.pie}`}>
      <div className={styles.chartTitle}>
        <i className="fa fa-chart-pie" /> Distribución por edad de los pacientes
      </div>
      <div className={styles.pieChartLayout}>
        <div className={styles.pieChartCanvas}>
          {loading ? <div>Cargando...</div> :
            <Pie
              data={data}
              options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
              width={180}
              height={180}
            />
          }
        </div>
        <div className={styles.pieChartLegend}>
          {chartData.labels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                display: "inline-block",
                width: 16,
                height: 16,
                borderRadius: 4,
                background: data.datasets[0].backgroundColor[i % data.datasets[0].backgroundColor.length]
              }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EdadPacientesChart;