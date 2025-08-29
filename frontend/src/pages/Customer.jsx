import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "../context/userContext";
import "./styles/Customer.css";

const Customer = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState("Usuario");
  const navigate = useNavigate();

  // Obtener nombre desde localStorage al montar el componente
  useEffect(() => {
    const storedName = localStorage.getItem("nombre");
    if (storedName) setUserName(storedName);
  }, []);

  const handleStart = () => {
    navigate("/disclaimer", { state: { userName } });
  };

  // Redirigir si no es cliente
  useEffect(() => {
    if (!user || user.role !== "cliente") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="landing-container">
      {/* Header dinámico según rol */}
      <Header />

      {/* Sección principal */}
      <section className="featu-section" id="features">
        <div className="container">
          <br /><br />
          <h2>Bienvenido {userName}</h2>
          <br /><br />
          <p>
            Estás por comenzar una evaluación que nos permitirá conocer mejor las habilidades, rutinas y necesidades del niño en distintas áreas clave del desarrollo.
            Esta información será útil para brindar un acompañamiento más personalizado y efectivo. Estas son las áreas que evaluamos
          </p>
          <br />

          <div className="features-grid">
            <div className="feature-item">
              <div className="icon">👶</div>
              <h3>Historia del Desarrollo</h3>
              <p>Desde el gateo y la marcha hasta el control de esfínteres, exploramos los hitos clave del desarrollo motor y de autonomía.</p>
            </div>
            <div className="feature-item">
              <div className="icon">🍴</div>
              <h3>Alimentación</h3>
              <p>Evaluamos hábitos alimenticios, uso de utensilios, preferencias de consistencia y posibles dificultades sensoriales o motoras.</p>
            </div>
            <div className="feature-item">
              <div className="icon">🚿</div>
              <h3>Higiene</h3>
              <p>Analizamos la independencia en el baño, lavado de manos y colaboración en rutinas de higiene personal.</p>
            </div>
            <div className="feature-item">
              <div className="icon">🧥</div>
              <h3>Vestido y Desvestido</h3>
              <p>Observamos el nivel de autonomía del niño al vestirse y desvestirse, identificando posibles desafíos motores o de coordinación.</p>
            </div>
            <div className="feature-item">
              <div className="icon">🎲</div>
              <h3>Juego e Interacción</h3>
              <p>Comprendemos cómo el niño juega, su nivel de interacción con otros y su interés por el entorno lúdico.</p>
            </div>
            <div className="feature-item">
              <div className="icon">💬</div>
              <h3>Comunicación</h3>
              <p>Evaluamos las formas en que el niño se comunica, tanto verbal como no verbalmente, y su capacidad para expresar necesidades.</p>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button className="ctaa-button" onClick={handleStart}>
              Comenzar
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Customer;
