const pool = require("../config/postgres");
const FormularioDTO = require("../dto/postgres/formularioDTO");

class EstadisticasDAO {

    // Pacientes registrados por mes/año
    async pacientesPorMes() {
        try {
            const res = await pool.query("SELECT * FROM listar_pacientes_por_mes();");
            return res.rows; // [{ mes: "2025-01", total: 12 }, ...]
        } catch (error) {
            console.error("Error en EstadisticasDAO.pacientesPorMes:", error);
            throw error;
        }
    }
    // Distribución de edad de pacientes
    async distribucionEdadPacientes() {
        try {
            const res = await pool.query("SELECT * FROM listar_distribucion_edad_pacientes();");
            return res.rows; // [{ edad: "5", total: 7 }, ...]
        } catch (error) {
            console.error("Error en EstadisticasDAO.distribucionEdadPacientes:", error);
            throw error;
        }
    }

    // Promedio de puntaje por área en evaluaciones
    async promedioPuntajePorArea() {
        try {
            const res = await pool.query("SELECT * FROM listar_promedio_puntaje_por_area();");
            return res.rows; // [{ area: "Actividades Básicas", promedio: 1.87 }, ...]
        } catch (error) {
            console.error("Error en EstadisticasDAO.promedioPuntajePorArea:", error);
            throw error;
        }
    }

    async problemasHitos() {
        try {
            const res = await pool.query("SELECT * FROM listar_problemas_hitos_porcentaje();");
            return res.rows; // [{ hito: 'gateo', total: 10 }, ...]
        } catch (error) {
            console.error("Error en EstadisticasDAO.problemasHitos:", error);
            throw error;
        }
    }


}

module.exports = EstadisticasDAO;