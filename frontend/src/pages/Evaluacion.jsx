import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/header";
import "./styles/Formulario.css";

// 🔹 RadioGroup reutilizable
const RadioGroup = ({ name, value, options, onChange }) => {
  return (
    <div className="radio-group">
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
};

const Evaluacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formularioId } = location.state || {};

  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [contextos, setContextos] = useState({});
  const [puntajeTotal, setPuntajeTotal] = useState(null);

  // Cargar preguntas del backend
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/postgres/evaluaciones/preguntas", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPreguntas(data);

        // Inicializar respuestas y contextos vacíos
        const respuestasIniciales = {};
        const contextosIniciales = {};
        data.forEach(pregunta => {
          respuestasIniciales[pregunta.id] = "";
          contextosIniciales[pregunta.id] = [];
        });
        setRespuestas(respuestasIniciales);
        setContextos(contextosIniciales);
      } catch (error) {
        console.error("Error cargando preguntas:", error);
        alert("Error cargando el formulario");
      }
    };

    cargarPreguntas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas(prev => ({ ...prev, [name]: value }));
  };

  const handleContextoChange = (preguntaId, valor, checked) => {
    setContextos(prev => {
      const arr = new Set(prev[preguntaId] || []);
      if (checked) arr.add(valor);
      else arr.delete(valor);
      return { ...prev, [preguntaId]: Array.from(arr) };
    });
  };

  const calculateScore = () => {
    return Object.values(respuestas).reduce((total, val) => total + (parseInt(val) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPuntaje = calculateScore();
    setPuntajeTotal(totalPuntaje);

    if (!formularioId) {
      alert("Error: formularioId no disponible");
      return;
    }

    const payload = {
      formularioId: formularioId,
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
        // En lugar de navegar a /misformularios, navegamos a la página de resultados
        // con la información necesaria
        navigate(`/resultados/${data.evaluacionId}`, {
          state: {
            puntajeTotal: totalPuntaje,
            respuestas: payload.respuestas,
            fecha: new Date().toISOString()
          }
        });
      } else {
        console.error("Error del servidor:", data);
        alert(data.error || "Error guardando la evaluación");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor");
    }
  };

  const interpretar = () => {
    if (puntajeTotal <= 7) return "Desarrollo adecuado, no se requiere intervención inmediata.";
    if (puntajeTotal <= 15) return "Se recomienda seguimiento y acompañamiento.";
    return "Es necesaria intervención en Terapia Ocupacional.";
  };

  const renderContextos = (preguntaId, contextosDisponibles) => {
    if (respuestas[preguntaId] !== "2") return null;
    return (
      <div className="contextos-adicionales">
        <p className="contextos-titulo">Contextos asociados (marque los que apliquen):</p>
        <div className="checkbox-group">
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
    <div className="formulario-page">
      <Header />
      <div className="anamnesis-container">
        <h2>SECCIÓN II – EVALUACIÓN DEL PERFIL OCUPACIONAL</h2>
        <h3>Niños y niñas entre los 18 meses hasta los 5 años de edad</h3>

        <form onSubmit={handleSubmit} className="anamnesis-form">
          {preguntas.map(pregunta => (
            <fieldset
              key={pregunta.id}
              style={{
                backgroundColor:
                  pregunta.area === "Actividades Básicas" ? "#f0f8ff" :
                    pregunta.area === "Juego y Participación Social" ? "#e6ffe6" :
                      "#fff5e6"
              }}
            >
              {/* Solo mostramos la leyenda del área cuando cambia */}
              {preguntas.findIndex(p => p.area === pregunta.area) === preguntas.findIndex(p => p.id === pregunta.id) && (
                <legend>ÁREA: {pregunta.area}</legend>
              )}

              <label>{pregunta.id}. {pregunta.pregunta}</label>
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
            </fieldset>
          ))}

          <div className="button-group">
            <button type="submit" className="submit-button">Calcular Puntaje</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/misformularios")}
            >
              Cancelar
            </button>
          </div>

          {puntajeTotal !== null && (
            <div className="resultado">
              <h3>Puntaje total: {puntajeTotal}</h3>
              <p>{interpretar()}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Evaluacion;