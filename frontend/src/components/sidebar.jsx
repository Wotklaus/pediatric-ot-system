import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext"; // Importar el contexto de usuario
import "../pages/styles/Sidebar.css"; // Importar los estilos

const Sidebar = () => {
  const { user } = useUser(); // Obtener el usuario actual del contexto

  return (
    // Navbar lateral principal
    <nav className="sidebar" id="sidebar">
      {/* Logo superior */}
      <div className="sidebar-logo">
        CATOPI
        
      </div>
      {/* Contenido del sidebar */}
      <div className="sidebar-content">
        {/* SI EL USUARIO LOGUEADO ES ADMIN */}
        {user?.role === "admin" && (
          <>
            {/* Sección CORE solo para admin */}
            <div className="sidebar-heading">CORE</div>
            <Link className="sidebar-link" to="/admin-panel">
              <i className="fas fa-tachometer-alt"></i> Admin Panel
            </Link>

            {/* Sección ACCESOS solo para admin */}
            <div className="sidebar-heading">ACCESOS</div>
            <div className="sidebar-group">
              {/* Botón para desplegar Usuarios */}
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
              {/* Submenú de usuarios */}
              <div className="collapse" id="collapseUsuarios">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/personal-medico">
                    Personal Médico
                  </Link>
                  <Link className="sidebar-link" to="/clientes">
                    Clientes
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
            {/* Sección REPORTES solo para admin */}
            <div className="sidebar-heading">REPORTES</div>
            <div className="sidebar-group">
              {/* Botón para desplegar Reportes */}
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
              {/* Submenú de reportes */}
              <div className="collapse" id="collapseReportes">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/historias-clinicas">
                    Historias Clínicas
                  </Link>
                  <Link className="sidebar-link" to="/estadisticas">
                    Estadísticas
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SI EL USUARIO LOGUEADO ES CLIENTE */}
        {user?.role === "cliente" && (
          <>
            {/* Sección exclusiva para cliente */}
            <div className="sidebar-heading">CLIENTE</div>
            {/* Acceso directo a dashboard */}
            <Link className="sidebar-link" to="/customer">
              <i className="fas fa-home"></i> Inicio
            </Link>
            {/* Menú desplegable para perfil */}
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
              {/* Submenú de perfil */}
              <div className="collapse" id="collapsePerfilCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/perfil">
                    Personal
                  </Link>
                  <Link className="sidebar-link" to="/cliente-nino">
                    Perfil del Niño
                  </Link>
                </div>
              </div>
            </div>
            {/* Menú desplegable para formularios */}
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
              {/* Submenú de formularios */}
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
            {/* Menú desplegable para Reportes */}
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
              {/* Submenú de reportes */}
              <div className="collapse" id="collapseReportesCliente">
                <div className="sidebar-nested">
                  <Link className="sidebar-link" to="/misformularios">
                    Historia Clínica
                  </Link>
                  <Link className="sidebar-link" to="/misresultados">
                    Resultados
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Footer con botón salir (siempre visible) */}
      <div className="sidebar-footer">
        <Link className="sidebar-link sidebar-logout" to="/home">
          <i className="fas fa-sign-out-alt"></i> Salir
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;