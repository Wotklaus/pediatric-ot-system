import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/Clientes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

const ENDPOINT = "http://localhost:5000/api/pg/usuarios/clientes";

const Clientes = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newUsuarioData, setNewUsuarioData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    email: "",
    contrasena: ""
  });

  useEffect(() => {
    fetchLista();
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

    const datos = {
      nombre: editData.nombre || null,
      apellido: editData.apellido || null,
      cedula: editData.cedula || null,
      telefono: editData.telefono || null,
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

  const handleDelete = async (id, email) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
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

  // REGISTRO DE CLIENTES: ESTE ES EL MÉTODO CORRECTO
  const handleAddChange = (e) => {
    setNewUsuarioData({ ...newUsuarioData, [e.target.name]: e.target.value });
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    if (
      !newUsuarioData.nombre.trim() ||
      !newUsuarioData.apellido.trim() ||
      !newUsuarioData.cedula.trim() ||
      !newUsuarioData.telefono.trim() ||
      !newUsuarioData.email.trim() ||
      !newUsuarioData.contrasena.trim()
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setAddLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: newUsuarioData.nombre,
          apellido: newUsuarioData.apellido,
          cedula: newUsuarioData.cedula,
          telefono: newUsuarioData.telefono,
          email: newUsuarioData.email,
          contrasena: newUsuarioData.contrasena,
          rol_id: 2 // ← ¡Este campo es obligatorio!
        }),
      });
      const respData = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(respData?.error || "Error añadiendo cliente");
      } else {
        setNewUsuarioData({
          nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          email: "",
          contrasena: ""
        });
        setShowAddForm(false);
        fetchLista();
      }
    } catch {
      setError("Error de conexión al añadir cliente.");
    }
    setAddLoading(false);
  };

  return (
    <div className="clientes-layout">
      <Sidebar className="clientes-sidebar" />
      <div className="clientes-content container">
        <h2 className="mt-4">Clientes</h2>
        <br />
        <br />
        <div className="clientes-card mb-4">
          <div className="clientes-card-header">
            <i className="fas fa-users me-1"></i>
            Registro de Clientes
          </div>
          <div className="card-body">
            {loading ? (
              <div className="clientes-loader">Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                <table className="clientes-table table table-striped table-bordered" id="clientesTable">
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
                          No hay clientes registrados.
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
                                  className="btn btn-primary btn-sm me-2 clientes-btn-action"
                                  onClick={() => handleEditClick(usuario)}
                                  title="Editar"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm clientes-btn-action"
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
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                  <button
                    className="btn btn-success"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir cliente
                  </button>
                </div>
                {showAddForm && (
                  <form
                    onSubmit={handleAddUsuario}
                    className="mt-3"
                  >
                    <div className="row">
                      <div className="col-md-2 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          placeholder="Nombre"
                          value={newUsuarioData.nombre}
                          onChange={handleAddChange}
                          required
                          disabled={addLoading}
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          name="apellido"
                          placeholder="Apellido"
                          value={newUsuarioData.apellido}
                          onChange={handleAddChange}
                          required
                          disabled={addLoading}
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          name="cedula"
                          placeholder="Cédula"
                          value={newUsuarioData.cedula}
                          onChange={handleAddChange}
                          required
                          disabled={addLoading}
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          name="telefono"
                          placeholder="Teléfono"
                          value={newUsuarioData.telefono}
                          onChange={handleAddChange}
                          required
                          disabled={addLoading}
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Email"
                          value={newUsuarioData.email}
                          onChange={handleAddChange}
                          required
                          disabled={addLoading}
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <input
                          type="password"
                          className="form-control"
                          name="contrasena"
                          placeholder="Contraseña"
                          value={newUsuarioData.contrasena}
                          onChange={handleAddChange}
                          required
                          disabled={addLoading}
                        />
                      </div>
                      <div className="col-md-12 mt-2">
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
                            setNewUsuarioData({
                              nombre: "",
                              apellido: "",
                              cedula: "",
                              telefono: "",
                              email: "",
                              contrasena: ""
                            });
                          }}
                          disabled={addLoading}
                        >
                          <FontAwesomeIcon icon={faTimes} /> Cancelar
                        </button>
                      </div>
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

export default Clientes;