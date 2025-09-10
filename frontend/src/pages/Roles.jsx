import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PersonalMedico.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

const ENDPOINT = "http://localhost:5000/api/roles"; // endpoint correcto

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRolData, setNewRolData] = useState({ nombre: "" });
  const [addLoading, setAddLoading] = useState(false);

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
          setRoles([]);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRoles(data);
          setError("");
        } else {
          setRoles([]);
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
  const handleEditClick = (rol) => {
    setEditId(rol.id);
    setEditData({ ...rol });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const datos = {
      nombre: editData.nombre || null
      // Si agregas más campos en la DB, inclúyelos aquí
    };

    try {
      const res = await fetch(
        `${ENDPOINT}/${editId}`,
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
        setError(err?.error || "Error actualizando rol");
      } else {
        setEditId(null);
        setEditData({});
        fetchLista();
      }
    } catch {
      setError("Error de conexión al actualizar rol.");
    }
    setLoading(false);
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => { });
        setError(err?.error || "Error eliminando rol");
      } else {
        setRoles(roles.filter((r) => r.id !== id));
        setError("");
      }
    } catch {
      setError("Error de conexión al eliminar rol.");
    }
    setLoading(false);
  };

  // Añadir nuevo rol
  const handleAddChange = (e) => {
    setNewRolData({ ...newRolData, [e.target.name]: e.target.value });
  };

  const handleAddRol = async (e) => {
    e.preventDefault();
    if (!newRolData.nombre.trim()) {
      setError("El nombre del rol es obligatorio.");
      return;
    }
    setAddLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: newRolData.nombre }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => {});
        setError(err?.error || "Error añadiendo rol");
      } else {
        setNewRolData({ nombre: "" });
        setShowAddForm(false);
        fetchLista();
      }
    } catch {
      setError("Error de conexión al añadir rol.");
    }
    setAddLoading(false);
  };

  return (
    <div className="personalmedico-layout">
      <Sidebar />
      <div className="personalmedico-content container">
        <h2 className="mt-4">Roles</h2>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="/admin">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Roles</li>
        </ol>
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-user-shield me-1"></i>
            Tabla de Roles
          </div>
          <div className="card-body">
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                <table className="table table-striped table-bordered" id="rolesTable">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th style={{ textAlign: "center" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length === 0 ? (
                      <tr>
                        <td colSpan={2} style={{ textAlign: "center" }}>
                          No hay roles registrados.
                        </td>
                      </tr>
                    ) : (
                      roles.map((rol) => (
                        <tr key={rol.id}>
                          <td>
                            {editId === rol.id ? (
                              <input
                                name="nombre"
                                value={editData.nombre}
                                onChange={handleEditChange}
                              />
                            ) : (
                              rol.nombre
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {editId === rol.id ? (
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
                                  onClick={() => handleEditClick(rol)}
                                  title="Editar"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(rol.id)}
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
                {/* Botón Añadir rol */}
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                  <button
                    className="btn btn-success"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir rol
                  </button>
                </div>
                {/* Formulario para añadir rol */}
                {showAddForm && (
                  <form
                    onSubmit={handleAddRol}
                    className="mt-3"
                    style={{
                      background: "#f8f9fa",
                      padding: "1rem",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,.05)"
                    }}
                  >
                    <div className="mb-3">
                      <label htmlFor="rolNombre" className="form-label">
                        Nombre del rol
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rolNombre"
                        name="nombre"
                        value={newRolData.nombre}
                        onChange={handleAddChange}
                        required
                        disabled={addLoading}
                        autoFocus
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="btn btn-success me-2"
                        disabled={addLoading}
                      >
                        <FontAwesomeIcon icon={faSave} /> Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewRolData({ nombre: "" });
                        }}
                        disabled={addLoading}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;