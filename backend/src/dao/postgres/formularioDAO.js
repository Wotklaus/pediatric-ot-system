// src/dao/postgres/formularioDAO.js
const pool = require("../../config/postgres");
const FormularioDTO = require("../../dto/postgres/formularioDTO");

class FormularioDAO {

  // Insertar formulario usando el procedimiento almacenado
  async insertar(formularioDTO) {
    try {
      const resultado = await pool.query(
        "SELECT insertar_formulario($1, $2)",
        [formularioDTO, formularioDTO.userId] // JSONB + user_id
      );

      return { id: resultado.rows[0].insertar_formulario };
    } catch (error) {
      console.error("Error en DAO.insertar:", error);
      throw error;
    }
  }

  // Listar todos los formularios
  async listar() {
    try {
      const res = await pool.query("SELECT * FROM listar_formularios();");
      return res.rows;
    } catch (error) {
      console.error("Error en DAO.listar:", error);
      throw error;
    }
  }

  // Buscar un formulario por ID
  async buscarPorId(id) {
    try {
      const res = await pool.query("SELECT * FROM buscar_formulario_id($1);", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      console.error("Error en DAO.buscarPorId:", error);
      throw error;
    }
  }

  async listarVista() {
    try {
      const res = await pool.query("SELECT * FROM vista_formularios;");
      return res.rows;
    } catch (error) {
      console.error("Error en DAO.listarVista:", error);
      throw error;
    }
  }

  async listarPorUsuario(userId) {
    try {
      const res = await pool.query("SELECT * FROM vista_formularios WHERE user_id = $1", [userId]);
      return res.rows;
    } catch (error) {
      console.error("Error en DAO.listarPorUsuario:", error);
      throw error;
    }
  }

  async buscarPorIdVista(id) {
    try {
      const res = await pool.query("SELECT * FROM buscar_formulario_vista_id($1);", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      console.error("Error en DAO.buscarPorIdVista:", error);
      throw error;
    }
  }

  async listarPacientes() {
    try {
      const res = await pool.query("SELECT * FROM listar_pacientes();");
      return res.rows;
    } catch (error) {
      console.error("Error en DAO.listarPacientes:", error);
      throw error;
    }
  }

  async contarPacientes() {
    try {
      const res = await pool.query("SELECT * FROM contar_pacientes();");
      return res.rows[0].contar_pacientes;
    } catch (error) {
      console.error("Error en DAO.contarPacientes:", error);
      throw error;
    }
  }

  

}

module.exports = FormularioDAO;
