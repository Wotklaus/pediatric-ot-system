const express = require("express");
const router = express.Router();
const EvaluacionDAO = require("../../dao/postgres/evaluacionDAO");
const EvaluacionDTO = require("../../dto/postgres/evaluacionDTO");
const authMiddleware = require("../../middleware/auth"); // tu middleware JWT

const evaluacionDAO = new EvaluacionDAO();

// POST: Insertar evaluación completa
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado (quien completó el formulario)
    const body = req.body;

    // body debe traer: { formularioId, respuestas: [ { pregunta_id, respuesta, puntaje }, ... ] }
    console.log("📥 JSON crudo recibido desde React:", body);

    // Mapear al DTO
    const evaluacionDTO = new EvaluacionDTO({
      formularioId: body.formularioId,
      respuestas: body.respuestas
    });

    console.log("✅ DTO listo para insertar:", evaluacionDTO);

    // Insertar usando DAO (que llama al procedimiento insert_evaluacion)
    const resultado = await evaluacionDAO.insertar(evaluacionDTO);

    res.status(201).json({
      mensaje: "Evaluación guardada",
      evaluacionId: resultado.id
    });
  } catch (error) {
    console.error("❌ Error al guardar evaluación:", error);
    res.status(500).json({ error: "Error guardando evaluación" });
  }
});

// GET: Listar todas las evaluaciones
router.get("/", authMiddleware, async (req, res) => {
  try {
    const evaluaciones = await evaluacionDAO.listar();
    res.json(evaluaciones);
  } catch (error) {
    console.error("Error al listar evaluaciones:", error);
    res.status(500).json({ error: "Error al obtener evaluaciones" });
  }
});

// GET: Listar evaluaciones de un usuario específico
router.get("/usuario", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const evaluaciones = await evaluacionDAO.listarPorUsuario(userId);
    res.json(evaluaciones);
  } catch (error) {
    console.error("Error al listar evaluaciones del usuario:", error);
    res.status(500).json({ error: "Error al obtener evaluaciones del usuario" });
  }
});

module.exports = router;
