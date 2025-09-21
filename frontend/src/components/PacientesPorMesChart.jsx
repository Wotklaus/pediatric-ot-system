import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = {
  labels: ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05"],
  values: [10, 15, 8, 12, 20]
};

const PacientesPorMesChart = () => {
  return (
    <div className="card mb-4">
      <div className="card-header">Pacientes registrados por mes/año</div>
      <div className="card-body">
        <Bar
          data={{
            labels: chartData.labels,
            datasets: [{
              label: "Pacientes",
              data: chartData.values,
              backgroundColor: "#007bff"
            }]
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } }
          }}
        />
      </div>
    </div>
  );
};

export default PacientesPorMesChart;