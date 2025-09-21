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

// Ruta para obtener evaluación por formulario_id
router.get('/by-formulario/:formularioId', authMiddleware, async (req, res) => {
    const { formularioId } = req.params;
    try {
        // Buscar la evaluación vinculada a ese formulario
        const result = await evaluacionDAO.obtenerPorFormularioId(formularioId);

        if (!result) {
            return res.status(404).json({ error: "No existe una evaluación para este formulario." });
        }

        // Puedes calcular puntajeTotal y recomendación aquí si lo necesitas
        // Ejemplo:
        let puntajeTotal = 0;
        if (Array.isArray(result.respuestas)) {
            puntajeTotal = result.respuestas.reduce((acc, r) => acc + (r.puntaje || 0), 0);
        }
        // Puedes agregar lógica para recomendación si tienes reglas

        res.json({
            ...result,
            puntajeTotal,
            recomendacion: "Pendiente de lógica." // Cambia según tu algoritmo, si tienes uno
        });
    } catch (error) {
        console.error("❌ Error obteniendo evaluación:", error);
        res.status(500).json({ error: "Error obteniendo evaluación" });
    }
});

// Ruta para obtener TODAS las evaluaciones del usuario autenticado
router.get('/mis-evaluaciones', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        // Busca todas las evaluaciones del usuario, puedes adaptar los campos que necesites
        const evaluaciones = await evaluacionDAO.obtenerEvaluacionesPorUsuario(userId);

        // Si no hay evaluaciones, retorna array vacío (no error)
        res.json(
            (evaluaciones || []).map(ev => ({
                id: ev.id,
                puntajeTotal: ev.puntaje_total || 0,
                fecha: ev.fecha,
                recomendacion: ev.recomendacion || "Sin recomendación"
            }))
        );
    } catch (error) {
        console.error("❌ Error obteniendo historial de evaluaciones:", error);
        res.status(500).json({ error: "Error obteniendo historial de evaluaciones" });
    }
});

router.get('/admin-evaluaciones', authMiddleware, async (req, res) => {
    try {
        const evaluaciones = await evaluacionDAO.obtenerTodasEvaluacionesConNino();

        // Si no hay evaluaciones, retorna array vacío (no error)
        res.json(
            (evaluaciones || []).map(ev => ({
                id: ev.id,
                nombre_nino: ev.nombre_nino,
                puntajeTotal: ev.puntaje_total,
                fecha: ev.fecha,
                recomendacion: ev.recomendacion
            }))
        );
    } catch (error) {
        console.error("❌ Error obteniendo todas las evaluaciones (admin):", error);
        res.status(500).json({ error: "Error obteniendo todas las evaluaciones" });
    }
});



router.get('/resumen-recomendacion', authMiddleware, async (req, res) => {
    try {
        const resumen = await evaluacionDAO.obtenerResumenRecomendaciones();
        res.json(resumen);
    } catch (error) {
        console.error("❌ Error obteniendo el resumen de recomendaciones:", error);
        res.status(500).json({ error: "Error obteniendo el resumen de recomendaciones" });
    }
});

router.get('/conteo-por-dia', authMiddleware, async (req, res) => {
    try {
        const conteoPorDia = await evaluacionDAO.obtenerConteoEvaluacionesPorDia();
        res.json(conteoPorDia);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo conteo por día" });
    }
});

router.get('/count', authMiddleware, async (req, res) => {
    try {
        if (req.user.rol_id !== 1) {
            return res.status(403).json({ error: "No tienes permiso" });
        }
        const count = await evaluacionDAO.contarEvaluaciones();
        res.json({ count });
    } catch (error) {
        console.error("❌ Error obteniendo contador de evaluaciones:", error);
        res.status(500).json({ error: "Error obteniendo contador de evaluaciones" });
    }
});

module.exports = router;