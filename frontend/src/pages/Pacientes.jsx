import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/sidebar";
import "./styles/Pacientes.css";

const ENDPOINT = "http://localhost:5000/api/formularios/pacientes";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  const fetchLista = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      setPacientes([]);
      setLoadingList(false);
      return;
    }

    setLoadingList(true);
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        let msg = `Error HTTP ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.error) msg = errData.error;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("No se obtuvo la lista esperada.");
      setPacientes(data);
      setError("");
    } catch (e) {
      setPacientes([]);
      setError(e?.message || "Error de conexión con el servidor.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchLista();
  }, [fetchLista]);

  return (
    <div className="pacientes-layout">
      <Sidebar />
      <div className="pacientes-content container">
        <h2 className="mt-4">Pacientes (Niños)</h2>
        <br />
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-child me-1"></i>
            Registro de Pacientes
          </div>
          <div className="card-body">
            {loadingList ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <table className="table table-striped table-bordered" id="pacientesTable">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha de nacimiento</th>
                    <th>Sexo</th>
                    <th>Cuidador principal</th>
                    <th>Nacionalidad</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        No hay pacientes registrados.
                      </td>
                    </tr>
                  ) : (
                    pacientes.map((p) => (
                      <tr key={p.paciente_id}>
                        <td>{p.nombre_nino}</td>
                        <td>{p.fecha_nacimiento}</td>
                        <td>{p.sexo}</td>
                        <td>{p.cuidador_principal}</td>
                        <td>{p.nacionalidad}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pacientes;