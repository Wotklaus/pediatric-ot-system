const express = require("express");
const router = express.Router();
const UsuarioDAO = require("../../dao/postgres/usuarioDAO");
const usuarioDAO = new UsuarioDAO();
const authMiddleware = require("../../middleware/auth"); // ✅ importar middleware

// GET protegido: obtener usuario por email
router.get("/:email", authMiddleware, async (req, res) => {
  try {
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
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// PUT protegido: actualizar perfil de usuario usando el email del token
router.put("/", authMiddleware, async (req, res) => {
  const email = req.user.email; // ✅ email del usuario desde el token
  const { nombre, apellido, cedula, telefono } = req.body;
  try {
    await usuarioDAO.actualizarPerfil(email, { nombre, apellido, cedula, telefono });
    res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario: { nombre, apellido, cedula, telefono, email },
    });
  } catch (error) {
    console.error("Error al actualizar perfil de usuario:", error);
    res.status(500).json({ error: "Error interno al actualizar perfil de usuario" });
  }
});

router.get("/personal-medico", authMiddleware, async (req, res) => {
  try {
    console.log("Petición recibida en /personal-medico por usuario:", req.user);

    if (req.user.rol_id === 1) {
      // Log antes de llamar al DAO
      console.log("El usuario es ADMIN, consultando lista de personal médico...");
      const lista = await usuarioDAO.listarPersonalMedico();
      // Log después de llamar al DAO
      console.log("Lista obtenida desde DAO:", lista);
      return res.json(Array.isArray(lista) ? lista : []);
    }

    if (req.user.rol_id === 3) {
      console.log("El usuario es PERSONAL MÉDICO, buscando sus datos...");
      const user = await usuarioDAO.buscarPorEmail(req.user.email);
      console.log("Usuario obtenido por email:", user);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      return res.json([user]);
    }

    console.log("El usuario no tiene permiso para ver esta información.");
    res.status(403).json({ error: "No tienes permiso para ver esta información" });
  } catch (err) {
    console.error("Error en /personal-medico:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
