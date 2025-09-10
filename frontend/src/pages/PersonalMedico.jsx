import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PersonalMedico.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const ENDPOINT = "http://localhost:5000/api/pg/usuarios/personal-medico";

const PersonalMedico = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Cargar lista
  useEffect(() => {
    fetchLista();
    // eslint-disable-next-line
  }, []);

  const fetchLista = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(ENDPOINT, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => { });
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
          setError("");
        } else {
          setUsuarios([]);
          setError("No se obtuvo la lista esperada.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor.");
        setLoading(false);
      });
  };

  // Editar
  const handleEditClick = (usuario) => {
    setEditId(usuario.id);
    setEditData({ ...usuario });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
  const token = localStorage.getItem("token");
  setLoading(true);

  // Solo los campos que realmente pueden ser editados
  const datos = {
    nombre: editData.nombre || null,
    apellido: editData.apellido || null,
    cedula: editData.cedula || null,
    telefono: editData.telefono || null,
    // Si tienes más campos en tu backend (ej: contrasena, rol_id), agrégalos aquí
    // contrasena: editData.contrasena || null,
    // rol_id: editData.rol_id || null,
  };

  try {
    const res = await fetch(
      `http://localhost:5000/api/pg/usuarios/${editData.email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => {});
      setError(err?.error || "Error actualizando usuario");
    } else {
      setEditId(null);
      setEditData({});
      fetchLista();
    }
  } catch {
    setError("Error de conexión al actualizar usuario.");
  }
  setLoading(false);
};

  // Eliminar
  const handleDelete = async (id, email) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/pg/usuarios/${email}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => { });
        setError(err?.error || "Error eliminando usuario");
      } else {
        setUsuarios(usuarios.filter((u) => u.id !== id));
        setError("");
      }
    } catch {
      setError("Error de conexión al eliminar usuario.");
    }
    setLoading(false);
  };

  return (
    <div className="personalmedico-layout">
      <Sidebar />
      <div className="personalmedico-content container">
        <h2 className="mt-4">Personal Médico</h2>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="/admin">Dashboard</a>
          </li>
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
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No hay personal médico registrado.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id || usuario.email}>
                        <td>
                          {editId === usuario.id ? (
                            <input
                              name="nombre"
                              value={editData.nombre}
                              onChange={handleEditChange}
                            />
                          ) : (
                            usuario.nombre
                          )}
                        </td>
                        <td>
                          {editId === usuario.id ? (
                            <input
                              name="apellido"
                              value={editData.apellido}
                              onChange={handleEditChange}
                            />
                          ) : (
                            usuario.apellido
                          )}
                        </td>
                        <td>
                          {editId === usuario.id ? (
                            <input
                              name="cedula"
                              value={editData.cedula}
                              onChange={handleEditChange}
                            />
                          ) : (
                            usuario.cedula
                          )}
                        </td>
                        <td>
                          {editId === usuario.id ? (
                            <input
                              name="telefono"
                              value={editData.telefono}
                              onChange={handleEditChange}
                            />
                          ) : (
                            usuario.telefono
                          )}
                        </td>
                        <td>{usuario.email}</td>
                        <td style={{ textAlign: "center" }}>
                          {editId === usuario.id ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={handleEditSave}
                                title="Guardar"
                              >
                                <FontAwesomeIcon icon={faSave} />
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditId(null)}
                                title="Cancelar"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleEditClick(usuario)}
                                title="Editar"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(usuario.id, usuario.email)}
                                title="Eliminar"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </>
                          )}
                        </td>
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