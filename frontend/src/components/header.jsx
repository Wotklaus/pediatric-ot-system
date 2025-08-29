import React from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useUser } from "../context/userContext";
import "../pages/styles/Header.css";

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleLogout = () => {
        console.log("🔴 LOGOUT PRESIONADO"); // Debug
        setUser(null);
        localStorage.clear();
        navigate("/"); // Home
    };


    return (
        <header className="header">
            <div className="header-content">
                <div className="header-inner">
                    {/* Logo */}
                    <div className="logo-container">
                        <div className="logo-wrapper">
                            <div className="logo-icon">
                                <span className="logo-letter">C</span>
                            </div>
                            <div>
                                <div className="logo-title">CATOPI</div>
                                <div className="logo-subtitle">Insights</div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {!user && (
                            <>
                                <button className="nav-link" onClick={() => navigate("/registro")}>
                                    Registrarse
                                </button>
                                <button className="nav-link" onClick={() => navigate("/login")}>
                                    Iniciar sesión
                                </button>
                                <ScrollLink
                                    className="nav-link"
                                    to="benefits"
                                    smooth={true}
                                    duration={500}
                                    offset={-80}
                                >
                                    Beneficios
                                </ScrollLink>
                                <ScrollLink
                                    className="nav-link"
                                    to="how-it-works"
                                    smooth={true}
                                    duration={500}
                                    offset={-80}
                                >
                                    Cómo Funciona
                                </ScrollLink>
                                <ScrollLink
                                    className="nav-link"
                                    to="footer"
                                    smooth={true}
                                    duration={500}
                                    offset={-80}
                                >
                                    Contacto
                                </ScrollLink>
                            </>
                        )}

                        {user?.role === "admin" && (
                            <>
                                <button className="nav-link" onClick={() => navigate("/usuarios")}>
                                    Usuarios
                                </button>
                                <button className="nav-link" onClick={() => navigate("/roles")}>
                                    Roles
                                </button>
                                <button className="nav-link" onClick={() => navigate("/resultados")}>
                                    Resultados
                                </button>
                                <button className="nav-link" onClick={() => navigate("/reportes")}>
                                    Reportes
                                </button>
                                <button className="nav-link" onClick={() => navigate("/perfil")}>
                                    Perfil
                                </button>
                                <button className="nav-link" onClick={handleLogout}>
                                    Salir
                                </button>
                            </>
                        )}

                        {user?.role === "cliente" && (
                            <>
                                <button className="nav-link" onClick={() => navigate("/customer")}>
                                    Inicio
                                </button>
                                <button className="nav-link" onClick={() => navigate("/perfil")}>
                                    Perfil
                                </button>
                                <button className="nav-link" onClick={() => navigate("/misformularios")}>
                                    Resultados
                                </button>
                                <button className="nav-link" onClick={handleLogout}>
                                    Salir
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
