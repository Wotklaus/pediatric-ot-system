import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./styles/MisFormularios.css";

// Mapea "razones" técnicas a frases amigables
const convertirRazon = (razon) => {
  const mapa = {
    siempreCuna: "Siempre en la cuna",
    noPiso: "No pisa el suelo",
    noAnimaba: "No animaba a moverse",
    muchoAcostado: "Mucho tiempo acostado",
    prematuro: "Nacimiento prematuro",
    noBocaAbajo: "No se pone boca abajo",
    caminar: "Miedo a caminar",
    bajoPeso: "Bajo peso",
    usoAndador: "Uso de andador",
    loCargaban: "Siempre lo cargaban",
    noFuerza: "Falta de fuerza",
    noJugaba: "No jugaba",
    miedoBano: "Miedo al baño",
    dificilInstrucciones: "Dificultad para seguir instrucciones",
    noEnsenio: "No enseñó habilidades",
    muchaTV: "Viendo mucha televisión",
    problemasAuditivos: "Problemas auditivos",
    pocaAtencion: "Poca atención",
  };
  return mapa[razon] || razon;
};

export default function MisFormularios() {
  const [formularios, setFormularios] = useState([]);
  const [error, setError] = useState(null);

  // Controla qué tarjeta está expandida (índice) y las evaluaciones cargadas por formulario
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState({});

  // Configuración de preguntas para mapeo de textos
  const [preguntasConfig, setPreguntasConfig] = useState([]);

  // Carga los formularios del usuario
  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación");

        const res = await fetch("http://localhost:5000/api/formularios/mis-formularios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error al obtener formularios: ${res.status}`);

        const data = await res.json();
        setFormularios(data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFormularios();
  }, []);

  // Carga la configuración de preguntas desde el backend
  useEffect(() => {
    const fetchPreguntasConfig = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/postgres/evaluaciones/preguntas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPreguntasConfig(data);
        }
      } catch (err) {
        // Puedes mostrar un error si lo deseas
      }
    };
    fetchPreguntasConfig();
  }, []);

  // Cuando tocas el botón Detalles: expande/colapsa y carga la evaluación si no está cargada
  const handleExpand = async (formularioId, idx) => {
    if (expandedIdx === idx) {
      setExpandedIdx(null);
      return;
    }
    setExpandedIdx(idx);

    if (!evaluaciones[formularioId]) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/postgres/evaluaciones/by-formulario/${formularioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setEvaluaciones(prev => ({ ...prev, [formularioId]: data }));
        }
      } catch (err) {
        setEvaluaciones(prev => ({
          ...prev,
          [formularioId]: { error: "No se pudo cargar la evaluación." }
        }));
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-content-with-sidebar">
        {error ? (
          <p className="error">{error}</p>
        ) : !formularios.length ? (
          <p className="error">No hay formularios guardados.</p>
        ) : (
          <div className="mis-formularios">
            {formularios.map((f, idx) => (
              <div key={f.id} className="formulario-card">
                {/* Título de la evaluación */}
                <div className="evaluacion-titulo">
                  <h2>Historia Clínica {idx + 1}</h2>
                </div>
                {/* Cards en fila arriba */}
                <div className="info-sections-row">
                  {/* Datos del paciente */}
                  <div className="section-card datos-paciente">
                    <h3>Datos del paciente</h3>
                    <p><strong>Nombre:</strong> {f.nombre_nino}</p>
                    <p><strong>Edad:</strong> {f.edad}</p>
                    <p><strong>Sexo:</strong> {f.sexo}</p>
                    <p><strong>Cuidador principal:</strong> {f.cuidador_principal}</p>
                    <p><strong>Parentesco:</strong> {f.parentesco}</p>
                    <p><strong>Nacionalidad:</strong> {f.nacionalidad}</p>
                    <p><strong>Contacto:</strong> {f.contacto}</p>
                    <p><strong>Convivencia:</strong> {f.convivencia}</p>
                    <p><strong>Hermanos:</strong> {f.hermanos}</p>
                    <p><strong>Dificultades hermanos:</strong> {f.dificultades_hermanos}</p>
                    <p><strong>Cuidador durante el día:</strong> {f.cuidador_dia}</p>
                    {f.cuidador_dia_otro && <p><strong>Otro cuidador:</strong> {f.cuidador_dia_otro}</p>}
                  </div>
                  {/* Embarazo y parto */}
                  <div className="section-card embarazo-partos">
                    <h3>Embarazo y parto</h3>
                    <p><strong>Embarazo controlado:</strong> {f.embarazo_controlado}</p>
                    <p><strong>Complicaciones:</strong> {Array.isArray(f.complicaciones) ? f.complicaciones.join(", ") : f.complicaciones}</p>
                    {f.complicaciones_otro && <p><strong>Otra complicación:</strong> {f.complicaciones_otro}</p>}
                    <p><strong>Embarazo planeado:</strong> {f.embarazo_planeado}</p>
                    <p><strong>Tipo de parto:</strong> {f.tipo_parto}</p>
                    <p><strong>Prematuro:</strong> {f.prematuro}</p>
                    <p><strong>Hospitalización:</strong> {f.hospitalizacion}</p>
                    <p><strong>Tiempo hospitalización:</strong> {f.tiempo_hospitalizacion}</p>
                    <p><strong>Dificultad nacimiento:</strong> {f.dificultad_nacimiento}</p>
                    {f.dificultad_nacimiento_detalle && <p><strong>Detalle dificultad:</strong> {f.dificultad_nacimiento_detalle}</p>}
                  </div>
                  {/* Alimentación y desarrollo */}
                  <div className="section-card alimentacion-desarrollo">
                    <h3>Alimentación y desarrollo</h3>
                    <p><strong>Lactancia:</strong> {f.lactancia}</p>
                    <p><strong>Dificultades alimentación:</strong> {f.dificultades_alimentacion}</p>
                    {f.dificultades_alimentacion_desc && <p><strong>Detalle:</strong> {f.dificultades_alimentacion_desc}</p>}
                    <p><strong>Temperamento:</strong> {f.temperamento}</p>
                    <p><strong>Estimulación:</strong> {f.estimulacion}</p>
                  </div>
                </div>
                {/* Hitos abajo */}
                <div className="section-card hitos-desarrollo">
                  <h3>Hitos del desarrollo</h3>
                  <div className="hitos">
                    {f.hitos &&
                      Object.entries(f.hitos).map(([hito, info]) => (
                        <div key={hito} className="hito-card">
                          <h4>{hito.charAt(0).toUpperCase() + hito.slice(1)}</h4>
                          <p><strong>Edad registrada:</strong> {info.edad}</p>
                          <p><strong>Esperado:</strong> {info.esperado}</p>
                          {info.razon && info.razon.length > 0 && (
                            <ul>
                              {info.razon.map((r, i) => (
                                <li key={i}>{convertirRazon(r)}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                {/* Botón Detalles */}
                <div className="evaluacion-detalles-btn-container">
                  <button
                    className="evaluacion-detalles-btn"
                    onClick={() => handleExpand(f.id, idx)}
                  >
                    {expandedIdx === idx ? "Ocultar detalles" : "Detalles"}
                  </button>
                </div>
                {/* Panel de detalles de evaluación */}
                {expandedIdx === idx && (
                  <div className="evaluacion-detalles-expanded">
                    {!evaluaciones[f.id] ? (
                      <p>Cargando evaluación...</p>
                    ) : evaluaciones[f.id]?.error ? (
                      <p className="error">{evaluaciones[f.id].error}</p>
                    ) : (
                      <>
                        <h3>Resultados de la Evaluación</h3>
                        <div className="evaluacion-respuestas-list">
                          {evaluaciones[f.id].respuestas?.map((resp, i) => {
                            const preguntaObj = preguntasConfig.find(p => p.id === Number(resp.pregunta_id));
                            const opcionTexto = preguntaObj?.opciones?.[Number(resp.respuesta)] || resp.respuesta;

                            return (
                              <div key={i} className="evaluacion-respuesta-item">
                                <div>
                                  <strong> {i + 1}:</strong> {preguntaObj?.pregunta || `Pregunta ${resp.pregunta_id}`}
                                </div>
                                <div>
                                  <strong>Respuesta:</strong> {opcionTexto}
                                </div>
                                {resp.contextos && resp.contextos.length > 0 && (
                                  <div>
                                    <strong>Contextos asociados:</strong>
                                    <ul>
                                      {resp.contextos.map((c, idx) => (
                                        <li key={idx}>{c}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}