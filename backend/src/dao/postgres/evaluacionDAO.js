// dao/postgres/evaluacionDAO.js
const pool = require('../../config/postgres');

class EvaluacionDAO {
    async guardarEvaluacion(evaluacion) {
        try {
            // Asegurarnos de que todas las respuestas tengan la estructura correcta
            const respuestasLimpias = evaluacion.respuestas.map(r => ({
                pregunta_id: r.pregunta_id,
                respuesta: r.respuesta || '',  // Si es null o undefined, usar string vacío
                puntaje: r.puntaje || 0,      // Si es null o undefined, usar 0
                contextos: Array.isArray(r.contextos) ? r.contextos : [] // Asegurar que siempre sea array
            }));

            console.log("🔍 Respuestas preparadas para BD:", JSON.stringify(respuestasLimpias, null, 2));

            const result = await pool.query(
                'SELECT fn_guardar_evaluacion($1, $2, $3::jsonb)',
                [
                    evaluacion.formulario_id,
                    evaluacion.user_id,
                    JSON.stringify(respuestasLimpias)
                ]
            );

            console.log("✅ Resultado de BD:", result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error("❌ Error en DAO:", error);
            throw error;
        }
    }
}

// Exportar la clase (no una instancia)
module.exports = EvaluacionDAO;