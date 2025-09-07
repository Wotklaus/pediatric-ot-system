import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PersonalMedico.css";

const ENDPOINT = "http://localhost:5000/api/pg/usuarios/personal-medico"; // Endpoint backend

const PersonalMedico = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      setLoading(false);
      return;
    }

    fetch(ENDPOINT, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        // Manejo de errores HTTP
        if (!res.ok) {
          const errData = await res.json().catch(()=>{});
          let errMsg = errData?.error ? errData.error : `Error HTTP ${res.status}`;
          setError(errMsg);
          setUsuarios([]);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setUsuarios([]);
          setError("No se obtuvo la lista esperada.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error de conexión con el servidor.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="personalmedico-layout">
      <Sidebar />
      <div className="personalmedico-content container">
        <h2 className="mt-4">Personal Médico</h2>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
          <li className="breadcrumb-item active">Personal Médico</li>
        </ol>
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-user-md me-1"></i>
            Tabla de Personal Médico
          </div>
          <div className="card-body">
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <table className="table table-striped table-bordered" id="personalMedicoTable">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center' }}>No hay personal médico registrado.</td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id || usuario.email}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.apellido}</td>
                        <td>{usuario.cedula}</td>
                        <td>{usuario.telefono}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : ''}</td>
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

export default PersonalMedico;