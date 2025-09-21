// src/routes/postgres/formulario.routes.js
const express = require("express");
const router = express.Router();
const FormularioDAO = require("../../dao/postgres/formularioDAO");
const FormularioDTO = require("../../dto/postgres/formularioDTO");
const authMiddleware = require("../../middleware/auth"); // tu middleware JWT

const formularioDAO = new FormularioDAO();

// POST: Insertar un formulario completo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // 🔹 Obtenemos ID del usuario desde el token
    const body = req.body;

    // 👉 PRIMER LOG: ver JSON recibido
    console.log("📥 JSON crudo recibido desde React:", body);

    // Mapear los datos del body al DTO
    const formularioDTO = new FormularioDTO({
      userId,

      // Sección 1
      nombreNino: body.nombre,
      edad: parseInt(body.edad),
      fechaNacimiento: body.fechaNacimiento,
      sexo: body.sexo,
      cuidadorPrincipal: body.cuidador,
      parentesco: body.parentesco,
      nacionalidad: body.nacionalidad,
      contacto: body.contacto,
      convivencia: body.convivencia,
      hermanos: body.hermanos,
      dificultadesHermanos: body.dificultadesHermanos,
      cuidadorDia: body.cuidadorDia,
      cuidadorDiaOtro: body.cuidadorDiaOtro,

      // Sección 2
      embarazoControlado: body.embarazoControlado,
      complicaciones: body.complicaciones || [],
      complicacionesOtro: body.complicacionesOtro,
      embarazoPlaneado: body.embarazoPlaneado,
      tipoParto: body.tipoParto,
      prematuro: body.prematuro,
      hospitalizacion: body.hospitalizacion,
      tiempoHospitalizacion: body.tiempoHospitalizacion,
      dificultadNacimiento: body.dificultadNacimiento,
      dificultadNacimientoDetalle: body.dificultadNacimientoDetalle,

      // Sección 3
      lactancia: body.lactancia,
      dificultadesAlimentacion: body.dificultadesAlimentacion,
      dificultadesAlimentacionDesc: body.dificultadesAlimentacionDesc,
      temperamento: body.temperamento,
      estimulacion: body.estimulacion,

      // Sección 4
      hitos: body.hitos || {},
    });

    // 👉 SEGUNDO LOG: ver cómo quedó el DTO antes de guardar
    console.log("✅ DTO listo para insertar:", formularioDTO);

    // Insertar usando DAO
    const resultado = await formularioDAO.insertar(formularioDTO);

    res.status(201).json({ mensaje: "Formulario guardado", id: resultado.id });
  } catch (error) {
    console.error("❌ Error al guardar formulario:", error);
    res.status(500).json({ error: "Error guardando formulario" });
  }

});

// GET: Listar formularios desde la vista
router.get("/vista", authMiddleware, async (req, res) => {
  try {
    const formularios = await formularioDAO.listarVista();
    res.json(formularios);
  } catch (error) {
    console.error("Error al obtener vista de formularios:", error);
    res.status(500).json({ error: "Error obteniendo vista de formularios" });
  }
});

// src/routes/postgres/formulario.routes.js
router.get("/mis-formularios", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado
    const formularios = await formularioDAO.listarPorUsuario(userId);
    res.json(formularios);
  } catch (error) {
    console.error("Error al listar formularios del usuario:", error);
    res.status(500).json({ error: "Error al obtener formularios" });
  }
});

router.get("/vista/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const formulario = await formularioDAO.buscarPorIdVista(id);
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }
    res.json(formulario);
  } catch (error) {
    console.error("Error al obtener formulario por ID (vista):", error);
    res.status(500).json({ error: "Error obteniendo formulario por ID (vista)" });
  }
});

// GET: Listar pacientes 
router.get("/pacientes", authMiddleware, async (req, res) => {
  try {
    const pacientes = await formularioDAO.listarPacientes();
    res.json(pacientes);
  } catch (error) {
    console.error("Error al listar pacientes:", error);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

router.get("/pacientes/count", authMiddleware, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    const count = await formularioDAO.contarPacientes();
    res.json({ count });
  } catch (error) {
    console.error("Error al contar pacientes:", error);
    res.status(500).json({ error: "Error al obtener contador de pacientes" });
  }
});


module.exports = router;
