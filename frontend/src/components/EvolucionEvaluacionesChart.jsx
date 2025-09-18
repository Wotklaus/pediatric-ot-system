import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const colores = {
  "No se recomienda atención": "#43a047", // verde
  "Se recomienda atención": "#ffc107",    // amarillo
  "Atención urgente": "#d32f2f"           // rojo
};

const EvolucionEvaluacionesChart = () => {
  const [datos, setDatos] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado. Por favor inicia sesión.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/postgres/evaluaciones/resumen-recomendacion", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("No autorizado. Inicia sesión nuevamente.");
          throw new Error("Error cargando datos.");
        }
        return res.json();
      })
      .then(data => {
        setDatos([
          data["No se recomienda atención"] || 0,
          data["Se recomienda atención"] || 0,
          data["Atención urgente"] || 0
        ]);
        setLoading(false);
        setError("");
      })
      .catch(e => {
        setError(e.message);
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

  return (
    <div style={{ width: "100%", maxWidth: 350, margin: "0 auto" }}>
      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: "#d32f2f", padding: "10px" }}>{error}</div>}
      {!loading && !error && (
        <>
          <Doughnut data={chartData} />
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <strong>Distribución de recomendaciones</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default EvolucionEvaluacionesChart;