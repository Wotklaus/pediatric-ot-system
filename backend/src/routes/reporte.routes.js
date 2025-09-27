const express = require('express');
const router = express.Router();

const reporteEvaluacionDAO = require("../dao/reporteEvaluacionDAO");

router.get('/reporte-evaluaciones', async (req, res) => {
    try {
        const reporte = await reporteEvaluacionDAO.obtenerReporte();
        res.json(reporte);
    } catch (error) {
        console.error('Error obteniendo el reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;