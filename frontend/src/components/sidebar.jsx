import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext"; // Importar el contexto de usuario
import "../pages/styles/Sidebar.css"; // Importar los estilos

const Sidebar = () => {
  const { user } = useUser(); // Obtener el usuario actual del contexto

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        CATOPI
      </div>
      <div className="sidebar-content">
        {/* SI EL USUARIO LOGUEADO ES ADMIN */}
        {user?.role === "admin" && (
          <>
            <div className="sidebar-heading">CORE</div>
            <Link className="sidebar-link" to="/admin">
              <i className="fas fa-tachometer-alt"></i> Admin Panel
            </Link>
            <div className="sidebar-heading">ACCESOS</div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseUsuarios"
                aria-expanded="false"
                aria-controls="collapseUsuarios"
              >
                <i className="fas fa-table"></i> Usuarios
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseUsuarios">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/personalmedico">
                    Personal Médico
                  </Link>
                  <Link className="sidebar-link" to="/clientes">
                    Representantes
                  </Link>
                  <Link className="sidebar-link" to="/pacientes">
                    Pacientes
                  </Link>
                  <Link className="sidebar-link" to="/roles">
                    Roles
                  </Link>
                </div>
              </div>
            </div>
            <div className="sidebar-heading">REPORTES</div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseReportes"
                aria-expanded="false"
                aria-controls="collapseReportes"
              >
                <i className="fas fa-file-alt"></i> Reportes
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseReportes">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/historiasclinicas">
                    Historias Clínicas
                  </Link>
                  <Link className="sidebar-link" to="/resultadosEvaluacion">
                    Resultados
                  </Link>
                  <Link className="sidebar-link" to="/estadisticas">
                    Estadísticas
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SI EL USUARIO LOGUEADO ES ENCARGADO */}
        {user?.role === "encargado" && (
          <>
            <div className="sidebar-heading">ENCARGADO</div>
            <Link className="sidebar-link" to="/encargado">
              <i className="fas fa-home"></i> Inicio
            </Link>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsePerfilCliente"
                aria-expanded="false"
                aria-controls="collapsePerfilCliente"
              >
                <i className="fas fa-user"></i> Perfil
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapsePerfilCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/perfil">
                    Mi perfil
                  </Link>
                </div>
              </div>
            </div>
            <div className="sidebar-heading">ACCESOS</div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseUsuarios"
                aria-expanded="false"
                aria-controls="collapseUsuarios"
              >
                <i className="fas fa-table"></i> Usuarios
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseUsuarios">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/clientes">
                    Clientes
                  </Link>
                  <Link className="sidebar-link" to="/pacientes">
                    Pacientes
                  </Link>
                </div>
              </div>
            </div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFormulariosCliente"
                aria-expanded="false"
                aria-controls="collapseFormulariosCliente"
              >
                <i className="fas fa-file-alt"></i> Formularios
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseFormulariosCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/registrorepresentante">
                    Registro del Representante
                  </Link>
                  <Link className="sidebar-link" to="/formulario">
                    Anamnesis
                  </Link>
                  <Link className="sidebar-link" to="/evaluacion">
                    Evaluación
                  </Link>
                </div>
              </div>
            </div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseReportesCliente"
                aria-expanded="false"
                aria-controls="collapseReportesCliente"
              >
                <i className="fas fa-file-alt"></i> Reportes
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseReportesCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/historiasclinicas">
                    Historia Clínica
                  </Link>
                  <Link className="sidebar-link" to="/resultadosEvaluacion">
                    Resultados
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SI EL USUARIO LOGUEADO ES CLIENTE */}
        {user?.role === "cliente" && (
          <>
            <div className="sidebar-heading">CLIENTE</div>
            <Link className="sidebar-link" to="/customer">
              <i className="fas fa-home"></i> Inicio
            </Link>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsePerfilCliente"
                aria-expanded="false"
                aria-controls="collapsePerfilCliente"
              >
                <i className="fas fa-user"></i> Perfil
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapsePerfilCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/perfil">
                    Mi perfil
                  </Link>
                  <Link className="sidebar-link" to="/perfilpaciente">
                    Perfil del Niño
                  </Link>
                </div>
              </div>
            </div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFormulariosCliente"
                aria-expanded="false"
                aria-controls="collapseFormulariosCliente"
              >
                <i className="fas fa-file-alt"></i> Formularios
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseFormulariosCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/formulario">
                    Anamnesis
                  </Link>
                  <Link className="sidebar-link" to="/evaluacion">
                    Evaluación
                  </Link>
                </div>
              </div>
            </div>
            <div className="sidebar-group">
              <button
                className="sidebar-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseReportesCliente"
                aria-expanded="false"
                aria-controls="collapseReportesCliente"
              >
                <i className="fas fa-file-alt"></i> Reportes
                <span className="sidebar-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </span>
              </button>
              <div className="collapse" id="collapseReportesCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/misformularios">
                    Historia Clínica
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="sidebar-footer">
        <Link className="sidebar-link sidebar-logout" to="/home">
          <i className="fas fa-sign-out-alt"></i> Salir
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;