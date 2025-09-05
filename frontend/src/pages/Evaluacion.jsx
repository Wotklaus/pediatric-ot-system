import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./styles/Evaluacion.css";

// RadioGroup reutilizable
const RadioGroup = ({ name, value, options, onChange }) => (
  <div className="evaluacion-radio-group">
    {options.map((opt) => (
      <label key={opt.value}>
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={onChange}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

const Evaluacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formularioId } = location.state || {};

  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [contextos, setContextos] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState("");

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/postgres/evaluaciones/preguntas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setPreguntas(data);

        const respuestasIniciales = {};
        const contextosIniciales = {};
        data.forEach(p => {
          respuestasIniciales[p.id] = "";
          contextosIniciales[p.id] = [];
        });
        setRespuestas(respuestasIniciales);
        setContextos(contextosIniciales);
      } catch (error) {
        setMensaje("Error cargando el formulario");
        setMensajeTipo("error");
      }
    };
    cargarPreguntas();
  }, []);

  // Agrupa preguntas por área
  const preguntasPorArea = preguntas.reduce((acc, pregunta) => {
    if (!acc[pregunta.area]) acc[pregunta.area] = [];
    acc[pregunta.area].push(pregunta);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas(prev => ({ ...prev, [name]: value }));
  };

  const handleContextoChange = (preguntaId, valor, checked) => {
    setContextos(prev => {
      const arr = new Set(prev[preguntaId] || []);
      checked ? arr.add(valor) : arr.delete(valor);
      return { ...prev, [preguntaId]: Array.from(arr) };
    });
  };

  const calculateScore = () =>
    Object.values(respuestas).reduce((total, val) => total + (parseInt(val) || 0), 0);

  const interpretar = (puntajeTotal) => {
    if (puntajeTotal <= 7) return "Desarrollo adecuado, no se requiere intervención inmediata.";
    if (puntajeTotal <= 15) return "Se recomienda seguimiento y acompañamiento.";
    return "Es necesaria intervención en Terapia Ocupacional.";
  };

  const validateFields = () => {
    for (let pregunta of preguntas) {
      if (!respuestas[pregunta.id]) {
        setMensaje("Responde todas las preguntas antes de continuar.");
        setMensajeTipo("error");
        return false;
      }
    }
    setMensaje("");
    setMensajeTipo("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    if (!formularioId) {
      setMensaje("Error: formularioId no disponible");
      setMensajeTipo("error");
      return;
    }

    const puntajeTotal = calculateScore();
    const payload = {
      formularioId,
      respuestas: Object.keys(respuestas).map(preguntaId => ({
        pregunta_id: preguntaId,
        respuesta: respuestas[preguntaId],
        puntaje: parseInt(respuestas[preguntaId]) || 0,
        contextos: contextos[preguntaId] || []
      }))
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/postgres/evaluaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // AQUÍ navegas y pasas el evaluacionId y datos
        navigate("/MisResultados", {
          state: {
            evaluacionId: data.evaluacionId, // <-- El ID que te devuelve el backend
            puntajeTotal,
            recomendacion: interpretar(puntajeTotal),
            fecha: new Date().toISOString()
          }
        });
      } else {
        setMensaje(data.error || "Error guardando la evaluación");
        setMensajeTipo("error");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
      setMensajeTipo("error");
    }
  };

  const renderContextos = (preguntaId, contextosDisponibles) => {
    if (respuestas[preguntaId] !== "2") return null;
    return (
      <div className="evaluacion-contextos-adicionales">
        <p className="evaluacion-contextos-titulo">Contextos asociados (marque los que apliquen):</p>
        <div className="evaluacion-checkbox-group">
          {contextosDisponibles.map(txt => (
            <label key={txt}>
              <input
                type="checkbox"
                checked={contextos[preguntaId]?.includes(txt) || false}
                onChange={(e) => handleContextoChange(preguntaId, txt, e.target.checked)}
              />
              {txt}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="evaluacion-layout">
      <Sidebar />
      <div className="evaluacion-content">
        <section className="evaluacion-section">
          <h2>SECCIÓN II – EVALUACIÓN DEL PERFIL OCUPACIONAL</h2>
          <form onSubmit={handleSubmit} className="evaluacion-form">
            {Object.entries(preguntasPorArea).map(([area, preguntasArea]) => (
              <fieldset key={area} data-area={area}>
                <legend> {area}</legend>
                {preguntasArea.map((pregunta) => (
                  <div className="evaluacion-pregunta" key={pregunta.id}>
                    <label>
                      {pregunta.id}. {pregunta.pregunta}
                    </label>
                    <RadioGroup
                      name={pregunta.id}
                      value={respuestas[pregunta.id]}
                      onChange={handleChange}
                      options={pregunta.opciones.map((opt, idx) => ({
                        value: String(idx),
                        label: opt
                      }))}
                    />
                    {renderContextos(pregunta.id, pregunta.contextos)}
                  </div>
                ))}
              </fieldset>
            ))}
            {mensaje && (
              <div className={`evaluacion-toast ${mensajeTipo}`}>{mensaje}</div>
            )}
            <div className="evaluacion-buttons">
              <button type="submit" className="evaluacion-btn">Guardar</button>
              <button
                type="button"
                className="evaluacion-btn evaluacion-btn-danger"
                onClick={() => navigate("/customer")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Evaluacion;