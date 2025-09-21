import React from "react";
import { Doughnut } from "react-chartjs-2";

const chartData = {
  labels: [
    "No ha tenido tiempo", 
    "Tiene miedo", 
    "Falta comida", 
    "No hay juguetes", 
    "Ve mucha televisión"
  ],
  values: [8, 15, 5, 10, 12]
};

const DificultadesReportadasChart = () => {
  return (
    <div className="card mb-4">
      <div className="card-header">Distribución de dificultades reportadas</div>
      <div className="card-body">
        <Doughnut
          data={{
            labels: chartData.labels,
            datasets: [{
              data: chartData.values,
              backgroundColor: ["#ffc107", "#007bff", "#dc3545", "#28a745", "#6c757d"]
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
};

export default DificultadesReportadasChart;