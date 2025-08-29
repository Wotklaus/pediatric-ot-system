const pool = require("../../config/postgres");

class PreguntaDAO {

  // Listar todas las preguntas
  async listar() {
    try {
      const res = await pool.query("SELECT * FROM preguntas ORDER BY numero;");
      return res.rows;
    } catch (error) {
      console.error("Error en PreguntaDAO.listar:", error);
      throw error;
    }
  }

  // Buscar pregunta por ID
  async buscarPorId(id) {
    try {
      const res = await pool.query("SELECT * FROM preguntas WHERE id = $1;", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      console.error("Error en PreguntaDAO.buscarPorId:", error);
      throw error;
    }
  }
}

module.exports = PreguntaDAO;
