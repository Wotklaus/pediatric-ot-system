const pool = require("../../config/postgres");

class EvaluacionDAO {

  // Insertar evaluación usando el procedimiento almacenado
  async insertar(evaluacionDTO) {
    try {
      const resultado = await pool.query(
        "SELECT insertar_evaluacion($1, $2)",
        [evaluacionDTO.formularioId, JSON.stringify(evaluacionDTO.respuestas)]
      );

      return { id: resultado.rows[0].insertar_evaluacion };
    } catch (error) {
      console.error("Error en EvaluacionDAO.insertar:", error);
      throw error;
    }
  }

  // Listar todas las evaluaciones
  async listar() {
    try {
      const res = await pool.query("SELECT * FROM listar_evaluaciones();");
      return res.rows;
    } catch (error) {
      console.error("Error en EvaluacionDAO.listar:", error);
      throw error;
    }
  }

  // Buscar una evaluación por ID
  async buscarPorId(id) {
    try {
      const res = await pool.query("SELECT * FROM buscar_evaluacion_id($1);", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      console.error("Error en EvaluacionDAO.buscarPorId:", error);
      throw error;
    }
  }

}

module.exports = EvaluacionDAO;
