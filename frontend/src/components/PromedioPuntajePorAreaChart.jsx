import React from "react";
import { Bar } from "react-chartjs-2";

const chartData = {
  labels: ["Actividades Básicas", "Juego y Participación Social", "Habilidades del desempeño"],
  values: [3.8, 4.2, 3.5]
};

const PromedioPuntajePorAreaChart = () => {
  return (
    <div className="card mb-4">
      <div className="card-header">Promedio de puntaje por área en evaluaciones</div>
      <div className="card-body">
        <Bar
          data={{
            labels: chartData.labels,
            datasets: [{
              label: "Promedio Puntaje",
              data: chartData.values,
              backgroundColor: "#28a745"
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

export default PromedioPuntajePorAreaChart;