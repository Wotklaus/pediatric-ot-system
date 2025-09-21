const express = require("express");
const router = express.Router();
const UsuarioDAO = require("../../dao/postgres/usuarioDAO");
const usuarioDAO = new UsuarioDAO();
const authMiddleware = require("../../middleware/auth");

const ADMIN = 1;
const ENCARGADO = 3;

// Listar personal médico (solo admin o encargado)
router.get("/personal-medico", authMiddleware, async (req, res) => {
  try {
    // Log para depuración
    console.log("Petición recibida por:", req.user.email, "rol:", req.user.rol_id);

    // Control de acceso por rol
    if (req.user.rol_id === ADMIN) { // Admin
      const lista = await usuarioDAO.listarPersonalMedico();
      console.log("Admin obtuvo la lista:", lista.length);
      return res.json(lista);
    }
    if (req.user.rol_id === ENCARGADO) { // Encargado
      const user = await usuarioDAO.buscarPorEmail(req.user.email);
      console.log("Encargado obtuvo su perfil:", user ? user.email : "No encontrado");
      return res.json(user ? [user] : []);
    }
    // Otros roles
    console.log("Acceso denegado para:", req.user.email, "rol:", req.user.rol_id);
    return res.status(403).json({ error: "No tienes permiso" });
  } catch (err) {
    console.error("Error en /personal-medico:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Listar clientes (solo admin)
router.get("/clientes", authMiddleware, async (req, res) => {
  try {
    // Solo el admin puede ver todos los clientes
    if (req.user.rol_id !== ADMIN) {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    const lista = await usuarioDAO.listarClientes();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



// Consultar usuario por email (solo propio o admin)
router.get("/:email", authMiddleware, async (req, res) => {
  try {
    // Solo el propio usuario o el admin puede consultar
    if (req.user.email !== req.params.email && req.user.rol_id !== ADMIN) {
      return res.status(403).json({ error: "No tienes permiso para ver este perfil" });
    }
    const user = await usuarioDAO.buscarPorEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      telefono: user.telefono,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

// Actualizar perfil (solo propio)
router.put("/", authMiddleware, async (req, res) => {
  const email = req.user.email;
  const datos = req.body; // Solo contiene los campos del perfil
  try {
    await usuarioDAO.actualizarUsuario(email, datos);
    res.json({ mensaje: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al actualizar perfil de usuario" });
  }
});

// Actualizar usuario (solo admin)
router.put("/:email", authMiddleware, async (req, res) => {
  if (req.user.rol_id !== ADMIN) {
    return res.status(403).json({ error: "Solo el administrador puede realizar esta acción" });
  }
  const { email } = req.params;
  const datos = req.body;
  try {
    await usuarioDAO.actualizarUsuario(email, datos);
    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando usuario" });
  }
});

// Eliminar usuario (solo admin)
router.delete("/:email", authMiddleware, async (req, res) => {
  if (req.user.rol_id !== ADMIN) {
    return res.status(403).json({ error: "Solo el administrador puede eliminar usuarios" });
  }
  const { email } = req.params;
  try {
    await usuarioDAO.eliminarPorEmail(email);
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando usuario" });
  }
});

// NUEVO: Crear personal médico (solo admin)
router.post("/personal-medico", authMiddleware, async (req, res) => {
  if (req.user.rol_id !== ADMIN) {
    return res.status(403).json({ error: "Solo el administrador puede registrar personal médico" });
  }
  try {
    const { nombre, apellido, cedula, telefono, email, contrasena } = req.body;
    const result = await usuarioDAO.crearPersonalMedico({ nombre, apellido, cedula, telefono, email, contrasena });
    res.json({ id: result.id, mensaje: "Personal médico registrado correctamente" });
  } catch (error) {
    console.error("Error creando personal médico:", error);
    res.status(400).json({ error: error.message });
  }
});

// Contador de personal médico
router.get("/personal-medico/count", authMiddleware, async (req, res) => {
  try {
    if (req.user.rol_id !== ADMIN) {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    const lista = await usuarioDAO.listarPersonalMedico();
    res.json({ count: lista.length });
  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
});

// Contador de clientes (representantes)
router.get("/clientes/count", authMiddleware, async (req, res) => {
  try {
    if (req.user.rol_id !== ADMIN) {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    const lista = await usuarioDAO.listarClientes();
    res.json({ count: lista.length });
  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;