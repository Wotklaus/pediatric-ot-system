import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/sidebar";
import "./styles/PersonalMedico.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; // <--- NUEVO: SweetAlert2

const ENDPOINT = "http://localhost:5000/api/pg/usuarios/personal-medico";

const getRowKey = (u) => (u?.id ?? u?.email);

const norm = (v) => {
  if (typeof v !== "string") return v ?? null;
  const t = v.trim();
  return t === "" ? null : t;
};

const PersonalMedico = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [editKey, setEditKey] = useState(null);
  const [editData, setEditData] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  // Añadir usuario
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

  const fetchLista = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      setUsuarios([]);
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
      setUsuarios(data);
      setError("");
    } catch (e) {
      setUsuarios([]);
      setError(e?.message || "Error de conexión con el servidor.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchLista();
  }, [fetchLista]);

  // Editar
  const handleEditClick = (usuario) => {
    const key = getRowKey(usuario);
    setEditKey(key);
    setEditData({ ...usuario });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditKey(null);
    setEditData({});
  };

  // MODIFICADO: Actualizar usuario con SweetAlert2
  const handleEditSave = async () => {
    if (!editData?.email) {
      setError("No se puede actualizar: falta el email del usuario.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      return;
    }

    const rowKey = editKey ?? getRowKey(editData);
    setSavingKey(rowKey);
    setError("");

    const datos = {
      nombre: norm(editData.nombre),
      apellido: norm(editData.apellido),
      cedula: norm(editData.cedula),
      telefono: norm(editData.telefono),
    };

    try {
      const emailEncoded = encodeURIComponent(editData.email);
      const res = await fetch(`http://localhost:5000/api/pg/usuarios/${emailEncoded}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        let msg = "Error actualizando usuario";
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        throw new Error(msg);
      }

      setUsuarios((prev) =>
        prev.map((u) =>
          getRowKey(u) === rowKey ? { ...u, ...datos } : u
        )
      );
      setError("");
      handleEditCancel();
      // SweetAlert2 éxito
      Swal.fire({
        title: 'Actualizado',
        text: 'El usuario ha sido actualizado exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (e) {
      setError(e?.message || "Error de conexión al actualizar usuario.");
      Swal.fire({
        title: 'Error',
        text: e?.message || "Error de conexión al actualizar usuario.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setSavingKey(null);
    }
  };

  // ELIMINAR con SweetAlert2
  const handleDelete = async (usuario) => {
    const rowKey = getRowKey(usuario);

    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
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
    if (!token) {
      setError("No hay token de autenticación. Inicia sesión.");
      return;
    }

    setDeletingKey(rowKey);
    setError("");
    try {
      const emailEncoded = encodeURIComponent(usuario.email);
      const res = await fetch(`http://localhost:5000/api/pg/usuarios/${emailEncoded}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        let msg = "Error eliminando usuario";
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        throw new Error(msg);
      }

      setUsuarios((prev) => prev.filter((u) => getRowKey(u) !== rowKey));
      setError("");
      Swal.fire({
        title: 'Eliminado',
        text: 'El usuario ha sido eliminado exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (e) {
      setError(e?.message || "Error de conexión al eliminar usuario.");
      Swal.fire({
        title: 'Error',
        text: e?.message || "Error de conexión al eliminar usuario.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setDeletingKey(null);
    }
  };

  // MODIFICADO: Añadir usuario con SweetAlert2
  const handleAddChange = (e) => {
    setNewUsuarioData({ ...newUsuarioData, [e.target.name]: e.target.value });
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    if (
      !newUsuarioData.nombre.trim() ||
      !newUsuarioData.apellido.trim() ||
      !newUsuarioData.email.trim() ||
      !newUsuarioData.contrasena.trim()
    ) {
      setError("Nombre, apellido, email y contraseña son obligatorios.");
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
        body: JSON.stringify({
          nombre: norm(newUsuarioData.nombre),
          apellido: norm(newUsuarioData.apellido),
          cedula: norm(newUsuarioData.cedula),
          telefono: norm(newUsuarioData.telefono),
          email: norm(newUsuarioData.email),
          contrasena: norm(newUsuarioData.contrasena),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => {});
        setError(err?.error || "Error añadiendo usuario");
        Swal.fire({
          title: 'Error',
          text: err?.error || "Error añadiendo usuario",
          icon: 'error',
          timer: 3000,
          showConfirmButton: true
        });
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
        // SweetAlert2 éxito
        Swal.fire({
          title: 'Agregado',
          text: 'El usuario ha sido agregado exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch {
      setError("Error de conexión al añadir usuario.");
      Swal.fire({
        title: 'Error',
        text: "Error de conexión al añadir usuario.",
        icon: 'error',
        timer: 3000,
        showConfirmButton: true
      });
    }
    setAddLoading(false);
  };

  return (
    <div className="personalmedico-layout">
      <Sidebar />
      <div className="personalmedico-content container">
        <h2 className="mt-4">Personal Médico</h2>
        <br />
        <br />

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-user-md me-1"></i>
            Registro del Personal Médico
          </div>
          <div className="card-body">
            {loadingList ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
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
                      usuarios.map((usuario) => {
                        const rowKey = getRowKey(usuario);
                        const isEditing = editKey === rowKey;
                        const isSaving = savingKey === rowKey;
                        const isDeleting = deletingKey === rowKey;

                        return (
                          <tr key={rowKey}>
                            <td>
                              {isEditing ? (
                                <input
                                  name="nombre"
                                  value={editData.nombre ?? ""}
                                  onChange={handleEditChange}
                                />
                              ) : (
                                usuario.nombre
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  name="apellido"
                                  value={editData.apellido ?? ""}
                                  onChange={handleEditChange}
                                />
                              ) : (
                                usuario.apellido
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  name="cedula"
                                  value={editData.cedula ?? ""}
                                  onChange={handleEditChange}
                                />
                              ) : (
                                usuario.cedula
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  name="telefono"
                                  value={editData.telefono ?? ""}
                                  onChange={handleEditChange}
                                />
                              ) : (
                                usuario.telefono
                              )}
                            </td>
                            <td>{usuario.email}</td>
                            <td style={{ textAlign: "center" }}>
                              {isEditing ? (
                                <>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={handleEditSave}
                                    title="Guardar"
                                    aria-label="Guardar"
                                    disabled={isSaving}
                                  >
                                    <FontAwesomeIcon icon={faSave} />
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleEditCancel}
                                    title="Cancelar"
                                    aria-label="Cancelar"
                                    disabled={isSaving}
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
                                    aria-label="Editar"
                                    disabled={isDeleting}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(usuario)}
                                    title="Eliminar"
                                    aria-label="Eliminar"
                                    disabled={isDeleting || isSaving}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                {/* Botón Añadir personal */}
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                  <button
                    className="btn btn-success"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir personal
                  </button>
                </div>
                {/* Formulario para añadir personal */}
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

export default PersonalMedico;