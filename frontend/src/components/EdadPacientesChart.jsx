import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  labels: ["0-2 años", "3-4 años", "5+ años"],
  values: [20, 12, 7]
};

const EdadPacientesChart = () => (
  <div className="card mb-4">
    <div className="card-header">Distribución por edad de los pacientes</div>
    <div className="card-body">
      <Pie
        data={{
          labels: chartData.labels,
          datasets: [{
            data: chartData.values,
            backgroundColor: ["#007bff", "#28a745", "#ffc107"]
          }]
        }}
        options={{
          responsive: true,
          plugins: { legend: { position: "right" } }
        }}
      />
    </div>
  </div>
);

export default EdadPacientesChart;