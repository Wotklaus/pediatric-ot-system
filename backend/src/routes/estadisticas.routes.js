const express = require("express");
const router = express.Router();
const EstadisticasDAO = require("../dao/EstadisticasDAO");
const authMiddleware = require("../middleware/auth");

const estadisticasDAO = new EstadisticasDAO();

// GET: Pacientes registrados por mes/año
router.get("/pacientes-por-mes", authMiddleware, async (req, res) => {
    try {
        const data = await estadisticasDAO.pacientesPorMes();
        const labels = data.map(row => row.mes);
        const values = data.map(row => row.total);
        res.json({ labels, values });
    } catch (error) {
        console.error("Error en /estadisticas/pacientes-por-mes:", error);
        res.status(500).json({ error: "Error obteniendo estadística de pacientes por mes" });
    }
});

router.get("/distribucion-edad", authMiddleware, async (req, res) => {
    try {
        const data = await estadisticasDAO.distribucionEdadPacientes();
        const labels = data.map(row => row.edad);
        const values = data.map(row => row.total);
        res.json({ labels, values });
    } catch (error) {
        console.error("Error en /estadisticas/distribucion-edad:", error);
        res.status(500).json({ error: "Error obteniendo distribución por edad" });
    }
});

// GET: Promedio de puntaje por área en evaluaciones
router.get("/promedio-puntaje-area", authMiddleware, async (req, res) => {
    try {
        const data = await estadisticasDAO.promedioPuntajePorArea();
        const labels = data.map(row => row.area);
        const values = data.map(row => Number(row.promedio));
        res.json({ labels, values });
    } catch (error) {
        console.error("Error en /estadisticas/promedio-puntaje-area:", error);
        res.status(500).json({ error: "Error obteniendo promedio por área" });
    }
});

// GET: Problemas con los hitos del desarrollo
router.get("/problemas-hitos", authMiddleware, async (req, res) => {
    try {
        const data = await estadisticasDAO.problemasHitos();
        const labels = data.map(row => row.hito);
        const values = data.map(row => row.porcentaje);
        res.json({ labels, values });
    } catch (error) {
        console.error("Error en /estadisticas/problemas-hitos:", error);
        res.status(500).json({ error: "Error obteniendo problemas con hitos" });
    }
});

module.exports = router;