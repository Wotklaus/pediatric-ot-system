const pool = require("../config/postgres");
const reporteEvaluacionDTO = require("../dto/reporteEvaluacionDTO");

class ReporteEvaluacionDAO {
    static async obtenerReporte() {
        const query = 'SELECT * FROM obtener_reporte_evaluaciones()';
        const { rows } = await pool.query(query);
        return rows.map(row => new reporteEvaluacionDTO({
            nombreNino: row.nombre_nino,
            fechaNacimiento: row.fecha_nacimiento,
            sexo: row.sexo,
            fechaEvaluacion: row.fecha_evaluacion,
            puntaje: row.puntaje,
            recomendacion: row.recomendacion
        }));
    }
}

module.exports = ReporteEvaluacionDAO;