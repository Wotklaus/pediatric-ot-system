import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "../pages/styles/DashboardCharts.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ENDPOINT = "http://localhost:5000/api/estadisticas/problemas-hitos";

const DificultadesReportadasChart = () => {
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

  const colores = [
    "#ffc107", "#007bff", "#dc3545", "#28a745", "#6c757d",
    "#17a2b8", "#6610f2", "#fd7e14", "#e83e8c", "#20c997"
  ];

  const data = {
    labels: chartData.labels,
    datasets: [{
      data: chartData.values,
      backgroundColor: colores.slice(0, chartData.labels.length)
    }]
  };

  return (
    <div className={`${styles.chartCard} ${styles.donut}`}>
      <div className={styles.chartTitle}>
        <i className="fa fa-chart-donut" /> Distribución de dificultades reportadas
      </div>
      <div className={styles.donutChartLayout}>
        <div className={styles.donutChartCanvas}>
          {loading ? <div>Cargando...</div> :
            <Doughnut
              data={data}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false
              }}
              width={220}
              height={220}
            />
          }
        </div>
        <div className={styles.donutChartLegend}>
          {chartData.labels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                display: "inline-block",
                width: 20,
                height: 20,
                borderRadius: 5,
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

export default DificultadesReportadasChart;