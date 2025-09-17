import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/Roles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; // <--- IMPORTA SWEETALERT2

const ENDPOINT = "http://localhost:5000/api/roles";

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

  // MODIFICADO: Actualizar rol con SweetAlert2
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
        Swal.fire({
          title: 'Error',
          text: err?.error || "Error actualizando rol",
          icon: 'error',
          timer: 3000,
          showConfirmButton: true
        });
      } else {
        setEditId(null);
        setEditData({});
        fetchLista();
        Swal.fire({
          title: 'Actualizado',
          text: 'El rol ha sido actualizado exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch {
      setError("Error de conexión al actualizar rol.");
      Swal.fire({
        title: 'Error',
        text: "Error de conexión al actualizar rol.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
    }
    setLoading(false);
  };

  // ELIMINAR con SweetAlert2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar rol?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (!result.isConfirmed) return;

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
        Swal.fire({
          title: 'Error',
          text: err?.error || "Error eliminando rol",
          icon: 'error',
          timer: 3000,
          showConfirmButton: true
        });
      } else {
        setRoles(roles.filter((r) => r.id !== id));
        setError("");
        Swal.fire({
          title: 'Eliminado',
          text: 'El rol ha sido eliminado exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch {
      setError("Error de conexión al eliminar rol.");
      Swal.fire({
        title: 'Error',
        text: "Error de conexión al eliminar rol.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
    }
    setLoading(false);
  };

  // Añadir nuevo rol con SweetAlert2
  const handleAddChange = (e) => {
    setNewRolData({ ...newRolData, [e.target.name]: e.target.value });
  };

  const handleAddRol = async (e) => {
    e.preventDefault();
    if (!newRolData.nombre.trim()) {
      setError("El nombre del rol es obligatorio.");
      Swal.fire({
        title: 'Error',
        text: "El nombre del rol es obligatorio.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
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
        Swal.fire({
          title: 'Error',
          text: err?.error || "Error añadiendo rol",
          icon: 'error',
          timer: 3000,
          showConfirmButton: true
        });
      } else {
        setNewRolData({ nombre: "" });
        setShowAddForm(false);
        fetchLista();
        Swal.fire({
          title: 'Agregado',
          text: 'El rol ha sido agregado exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch {
      setError("Error de conexión al añadir rol.");
      Swal.fire({
        title: 'Error',
        text: "Error de conexión al añadir rol.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
    }
    setAddLoading(false);
  };

  return (
    <div className="roles-layout">
      <Sidebar />
      <div className="roles-content container">
        <h2 className="mt-4">Roles de Usuario</h2>
        <br />
        <br />
        <div className="roles-card mb-4">
          <div className="roles-card-header">
            <i className="fas fa-user-shield me-1"></i>
            Registro de Roles
          </div>
          <div className="roles-card-body">
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="roles-alert roles-alert-danger">{error}</div>
            ) : (
              <>
                <table className="roles-table table table-striped table-bordered" id="rolesTable">
                  <thead>
                    <tr>
                      <th>Rol</th>
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
                                  className="roles-btn roles-btn-success btn btn-sm me-2"
                                  onClick={handleEditSave}
                                  title="Guardar"
                                >
                                  <FontAwesomeIcon icon={faSave} />
                                </button>
                                <button
                                  className="roles-btn roles-btn-secondary btn btn-sm"
                                  onClick={() => setEditId(null)}
                                  title="Cancelar"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="roles-btn roles-btn-primary btn btn-sm me-2"
                                  onClick={() => handleEditClick(rol)}
                                  title="Editar"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className="roles-btn roles-btn-danger btn btn-sm"
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
                    className="roles-btn roles-btn-success"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir rol
                  </button>
                </div>
                {/* Formulario para añadir rol */}
                {showAddForm && (
                  <form
                    onSubmit={handleAddRol}
                    className="roles-add-form mt-3"
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
                        className="roles-btn roles-btn-success me-2"
                        disabled={addLoading}
                      >
                        <FontAwesomeIcon icon={faSave} /> Guardar
                      </button>
                      <button
                        type="button"
                        className="roles-btn roles-btn-secondary"
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