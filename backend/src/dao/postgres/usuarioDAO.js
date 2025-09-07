const pool = require("../../config/postgres");
const usuarioDTO = require("../../dto/postgres/usuarioDTO");

class usuarioDAO {
  // Método crear con campo contrasena
  async crear({ nombre, apellido, cedula, telefono, email, contrasena, rol_id }) {
    const resultado = await pool.query(
      "SELECT nuevo_usuario($1, $2, $3, $4, $5, $6, $7)",
      [nombre, apellido, cedula, telefono, email, contrasena, rol_id]
    );
    return { id: resultado.rows[0].nuevo_usuario };
  }

  async buscarPorEmail(email) {
    const res = await pool.query("SELECT * FROM buscar_usuario_email($1)", [email]);
    if (res.rows.length === 0) return null;
    return new usuarioDTO(res.rows[0]);
  }

  // Actualizar también debe incluir contrasena
  async actualizar(email, datos) {
    const { nombre, apellido, cedula, telefono, contrasena, rol_id } = datos;
    await pool.query(
      "SELECT actualizar_usuario($1, $2, $3, $4, $5, $6, $7)",
      [email, nombre, apellido, cedula, telefono, contrasena, rol_id]
    );
  }

  async actualizarPerfil(email, nuevosDatosPerfil) {
    const { nombre, apellido, cedula, telefono } = nuevosDatosPerfil;
    // Llama a la nueva función de PostgreSQL que solo actualiza el perfil
    await pool.query(
      "SELECT actualizar_usuario($1, $2, $3, $4, $5)",
      [email, nombre, apellido, cedula, telefono]
    );
  }

  async listarPersonalMedico() {
    const res = await pool.query("SELECT * FROM obtener_personal_medico();");
    // Mapear cada fila a un DTO (sin contraseña por seguridad)
    return res.rows.map(row => {
      // Si el procedimiento incluye el campo 'rol' como string, pásalo; si no, omítelo o setéalo como 'Personal Médico'
      return new usuarioDTO({
        id: row.id,
        nombre: row.nombre,
        apellido: row.apellido,
        cedula: row.cedula,
        telefono: row.telefono,
        email: row.email,
        contrasena: undefined, // Nunca envíes la contraseña
        rol: row.rol || "Personal Médico" // Ajusta según lo que retorne el procedimiento
      });
    });
  }
}

module.exports = usuarioDAO;
