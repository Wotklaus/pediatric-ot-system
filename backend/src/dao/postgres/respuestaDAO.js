const pool = require("../../config/postgres");

class RespuestaDAO {

  // Listar todas las respuestas de una evaluación
  async listarPorEvaluacion(evaluacionId) {
    try {
      const res = await pool.query(
        "SELECT r.*, p.texto, p.area FROM respuestas r JOIN preguntas p ON r.pregunta_id = p.id WHERE r.evaluacion_id = $1 ORDER BY p.numero;",
        [evaluacionId]
      );
      return res.rows;
    } catch (error) {
      console.error("Error en RespuestaDAO.listarPorEvaluacion:", error);
      throw error;
    }
  }

}

module.exports = RespuestaDAO;
