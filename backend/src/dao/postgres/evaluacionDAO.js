const pool = require('../../config/postgres');
const EvaluacionDTO = require('../../dto/postgres/evaluacionDTO');

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
                'SELECT * FROM fn_guardar_evaluacion($1, $2, $3::jsonb)',
                [
                    evaluacion.formulario_id,
                    evaluacion.user_id,
                    JSON.stringify(respuestasLimpias)
                ]
            );

            // Instanciar el DTO con todos los campos incluyendo puntaje_total y recomendacion
            return new EvaluacionDTO(result.rows[0]);
        } catch (error) {
            console.error("❌ Error en DAO:", error);
            throw error;
        }
    }

    async obtenerPorFormularioId(formularioId) {
        try {
            const result = await pool.query(
                'SELECT * FROM fn_obtener_evaluacion_por_formulario($1)',
                [formularioId]
            );

            if (result.rows.length === 0) return null;
            // Instanciar el DTO con todos los campos
            return new EvaluacionDTO(result.rows[0]);
        } catch (error) {
            console.error("❌ Error en obtenerPorFormularioId:", error);
            throw error;
        }
    }

    async obtenerEvaluacionesPorUsuario(userId) {
        try {
            const result = await pool.query(
                'SELECT * FROM fn_mis_evaluaciones($1)',
                [userId]
            );
            // Mapear cada resultado a un DTO que incluye puntaje_total y recomendacion
            return result.rows.map(row => new EvaluacionDTO(row));
        } catch (error) {
            console.error("❌ Error en obtenerEvaluacionesPorUsuario:", error);
            throw error;
        }
    }

    async obtenerTodasEvaluacionesConNino() {
    try {
        const result = await pool.query('SELECT * FROM fn_todas_evaluaciones_con_nino()');
        return result.rows.map(row => new EvaluacionDTO(row)); // row.nombre_nino
    } catch (error) {
        console.error("❌ Error en obtenerTodasEvaluacionesConNino:", error);
        throw error;
    }
}

    
}

module.exports = EvaluacionDAO;