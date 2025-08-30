// routes/postgres/evaluacion.routes.js
const express = require("express");
const router = express.Router();
const EvaluacionDAO = require("../../dao/postgres/evaluacionDAO");
const EvaluacionDTO = require("../../dto/postgres/evaluacionDTO");
const authMiddleware = require("../../middleware/auth");
const PREGUNTAS = require("../../config/evaluacionConfig");

// Instanciar el DAO
const evaluacionDAO = new EvaluacionDAO();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const body = req.body;

        console.log("📥 JSON recibido desde React:", body);

        const evaluacionDTO = new EvaluacionDTO({
            formulario_id: body.formularioId,
            user_id: userId,
            fecha: new Date(),
            respuestas: body.respuestas
        });

        console.log("✅ DTO preparado:", evaluacionDTO);

        const resultado = await evaluacionDAO.guardarEvaluacion(evaluacionDTO);

        res.status(201).json({
            mensaje: "Evaluación guardada exitosamente",
            evaluacionId: resultado.fn_guardar_evaluacion // o resultado.id dependiendo de tu función
        });
    } catch (error) {
        console.error("❌ Error guardando evaluación:", error);
        res.status(500).json({ error: "Error al guardar la evaluación" });
    }
});


router.get("/preguntas", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Enviando preguntas desde archivo de configuración");
    res.json(PREGUNTAS);
  } catch (error) {
    console.error("❌ Error al obtener preguntas:", error);
    res.status(500).json({ error: "Error cargando preguntas" });
  }
});

module.exports = router;