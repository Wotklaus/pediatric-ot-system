// src/pages/Home.jsx
import React from "react";
import Layout from "../components/layout";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-inner">
            <h1 className="hero-title">
              <span className="hero-title-highlight">CARYAN:</span> Iluminando el Camino del
              <br />
              <span className="hero-title-block">Desarrollo Infantil</span>
            </h1>

            <p className="hero-subtitle">
              Una herramienta para comprender y potenciar el perfil ocupacional de infantes en etapa temprana
            </p>

            <div className="cta-container">
              <button className="cta-button" onClick={() => navigate("/registro")}>
                Empezar
              </button>
            </div>

            <div className="decorative-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>
          </div>
        </div>

        <div className="background-pattern">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
      </section>

      {/* Sección: Beneficios */}
      <section className="benefits-section" id="benefits">
        <div className="container">
          <h2>¿Por Qué Elegir CARYAN Insights?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="icon">🔍</div>
              <h3>Evaluación Precisa</h3>
              <p>Obtén una visión detallada y estandarizada del perfil ocupacional, fundamental para un diagnóstico temprano.</p>
            </div>
            <div className="benefit-item">
              <div className="icon">📈</div>
              <h3>Seguimiento Evolutivo</h3>
              <p>Monitorea el progreso del niño a lo largo del tiempo, ajustando las intervenciones según sus necesidades cambiantes.</p>
            </div>
            <div className="benefit-item">
              <div className="icon">💡</div>
              <h3>Recomendaciones Claras</h3>
              <p>El instrumento genera recomendaciones específicas para la intervención en Terapia Ocupacional, facilitando la toma de decisiones.</p>
            </div>
            <div className="benefit-item">
              <div className="icon">🧑‍🤝‍🧑</div>
              <h3>Empoderamiento Familiar</h3>
              <p>Ayuda a los cuidadores a comprender mejor el desarrollo de sus hijos y a participar activamente en su proceso de mejora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Proceso */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <h2>El Proceso de Evaluación CARYAN</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="icon">👤</div>
              <h3>1. Entrevista al Cuidador</h3>
              <p>El profesional realiza una entrevista estructurada con el cuidador principal para recopilar información detallada.</p>
            </div>
            <div className="step-item">
              <div className="icon">📊</div>
              <h3>2. Puntuación y Observación</h3>
              <p>Se asigna un puntaje a cada ítem (0, 1 o 2) y se registran observaciones profesionales.</p>
            </div>
            <div className="step-item">
              <div className="icon">📋</div>
              <h3>3. Análisis y Recomendación</h3>
              <p>El puntaje total determina el nivel de necesidad de intervención y se genera una recomendación clara.</p>
            </div>
            <div className="step-item">
              <div className="icon">📈</div>
              <h3>4. Seguimiento Continuo</h3>
              <p>La herramienta permite realizar evaluaciones de seguimiento para monitorear el progreso evolutivo del infante.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
