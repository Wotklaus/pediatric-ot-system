import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./styles/MisFormularios.css";

// Mapea razones técnicas a frases amigables
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

export default function FormularioDetalle() {
  const { id } = useParams();
  const [formulario, setFormulario] = useState(null);
  const [error, setError] = useState(null);

  // Para preguntas y evaluación
  const [preguntasConfig, setPreguntasConfig] = useState([]);
  const [evaluacion, setEvaluacion] = useState(null);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación");
        const res = await fetch(`http://localhost:5000/api/formularios/vista/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error al obtener formulario: ${res.status}`);
        const data = await res.json();
        setFormulario(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFormulario();
  }, [id]);

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
      } catch (err) {}
    };
    fetchPreguntasConfig();
  }, []);

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/postgres/evaluaciones/by-formulario/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setEvaluacion(data);
        }
      } catch (err) {
        setEvaluacion({ error: "No se pudo cargar la evaluación." });
      }
    };
    fetchEvaluacion();
  }, [id]);

  // ---- BOTÓN PDF ----
  const handleGenerarPDF = () => {
    if (!formulario) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Formulario", 14, 20);

    // Datos principales
    const datosPaciente = [
      ["Nombre del niño", formulario.nombre_nino],
      ["Edad", formulario.edad],
      ["Sexo", formulario.sexo],
      ["Cuidador principal", formulario.cuidador_principal],
      ["Parentesco", formulario.parentesco],
      ["Nacionalidad", formulario.nacionalidad],
      ["Contacto", formulario.contacto],
      ["Convivencia", formulario.convivencia],
      ["Hermanos", formulario.hermanos],
      ["Dificultades hermanos", formulario.dificultades_hermanos],
      ["Cuidador durante el día", formulario.cuidador_dia],
      ["Otro cuidador", formulario.cuidador_dia_otro],
      ["Embarazo controlado", formulario.embarazo_controlado],
      ["Complicaciones", Array.isArray(formulario.complicaciones) ? formulario.complicaciones.join(", ") : formulario.complicaciones],
      ["Otra complicación", formulario.complicaciones_otro],
      ["Embarazo planeado", formulario.embarazo_planeado],
      ["Tipo de parto", formulario.tipo_parto],
      ["Prematuro", formulario.prematuro],
      ["Hospitalización", formulario.hospitalizacion],
      ["Tiempo hospitalización", formulario.tiempo_hospitalizacion],
      ["Dificultad nacimiento", formulario.dificultad_nacimiento],
      ["Detalle dificultad nacimiento", formulario.dificultad_nacimiento_detalle],
      ["Lactancia", formulario.lactancia],
      ["Dificultades alimentación", formulario.dificultades_alimentacion],
      ["Detalle dificultades alimentación", formulario.dificultades_alimentacion_desc],
      ["Temperamento", formulario.temperamento],
      ["Estimulación", formulario.estimulacion]
    ].filter((d) => d[1]); // Solo si hay valor

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: datosPaciente,
      styles: { fontSize: 10 },
      theme: "striped",
      margin: { left: 14, right: 14 },
    });

    // Hitos del desarrollo
    if (formulario.hitos) {
      const hitosBody = Object.entries(formulario.hitos).map(([hito, info]) => [
        hito.charAt(0).toUpperCase() + hito.slice(1),
        info.edad,
        info.esperado,
        (info.razon && info.razon.length > 0) ? info.razon.map(convertirRazon).join(", ") : ""
      ]);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Hito", "Edad registrada", "Esperado", "Razones"]],
        body: hitosBody,
        styles: { fontSize: 10 },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });
    }

    // Evaluación
    if (evaluacion && evaluacion.respuestas?.length > 0) {
      const evalBody = evaluacion.respuestas.map((resp, i) => {
        const preguntaObj = preguntasConfig.find(p => p.id === Number(resp.pregunta_id));
        const opcionTexto = preguntaObj?.opciones?.[Number(resp.respuesta)] || resp.respuesta;
        return [
          i + 1,
          preguntaObj?.pregunta || `Pregunta ${resp.pregunta_id}`,
          opcionTexto,
          resp.contextos && resp.contextos.length > 0 ? resp.contextos.join(", ") : ""
        ];
      });
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["#", "Pregunta", "Respuesta", "Contextos"]],
        body: evalBody,
        styles: { fontSize: 10 },
        theme: "striped",
        margin: { left: 14, right: 14 },
      });
    }

    doc.save(`formulario_${formulario.id}_reporte.pdf`);
  };

  // ---- BOTÓN CSV ----
  const handleGenerarCSV = () => {
    if (!formulario) return;
    let csvRows = [];

    // Datos principales
    csvRows.push("Campo,Valor");
    [
      ["Nombre del niño", formulario.nombre_nino],
      ["Edad", formulario.edad],
      ["Sexo", formulario.sexo],
      ["Cuidador principal", formulario.cuidador_principal],
      ["Parentesco", formulario.parentesco],
      ["Nacionalidad", formulario.nacionalidad],
      ["Contacto", formulario.contacto],
      ["Convivencia", formulario.convivencia],
      ["Hermanos", formulario.hermanos],
      ["Dificultades hermanos", formulario.dificultades_hermanos],
      ["Cuidador durante el día", formulario.cuidador_dia],
      ["Otro cuidador", formulario.cuidador_dia_otro],
      ["Embarazo controlado", formulario.embarazo_controlado],
      ["Complicaciones", Array.isArray(formulario.complicaciones) ? formulario.complicaciones.join(", ") : formulario.complicaciones],
      ["Otra complicación", formulario.complicaciones_otro],
      ["Embarazo planeado", formulario.embarazo_planeado],
      ["Tipo de parto", formulario.tipo_parto],
      ["Prematuro", formulario.prematuro],
      ["Hospitalización", formulario.hospitalizacion],
      ["Tiempo hospitalización", formulario.tiempo_hospitalizacion],
      ["Dificultad nacimiento", formulario.dificultad_nacimiento],
      ["Detalle dificultad nacimiento", formulario.dificultad_nacimiento_detalle],
      ["Lactancia", formulario.lactancia],
      ["Dificultades alimentación", formulario.dificultades_alimentacion],
      ["Detalle dificultades alimentación", formulario.dificultades_alimentacion_desc],
      ["Temperamento", formulario.temperamento],
      ["Estimulación", formulario.estimulacion]
    ].filter((d) => d[1]).forEach((d) => {
      csvRows.push(`"${d[0]}","${String(d[1]).replace(/"/g, '""')}"`);
    });

    // Hitos
    if (formulario.hitos) {
      csvRows.push("\nHitos del desarrollo");
      csvRows.push("Hito,Edad registrada,Esperado,Razones");
      Object.entries(formulario.hitos).forEach(([hito, info]) => {
        csvRows.push(
          `"${hito.charAt(0).toUpperCase() + hito.slice(1)}","${info.edad}","${info.esperado}","${(info.razon && info.razon.length > 0) ? info.razon.map(convertirRazon).join(", ") : ""}"`
        );
      });
    }

    // Evaluación
    if (evaluacion && evaluacion.respuestas?.length > 0) {
      csvRows.push("\nResultados de la evaluación");
      csvRows.push("#,Pregunta,Respuesta,Contextos");
      evaluacion.respuestas.forEach((resp, i) => {
        const preguntaObj = preguntasConfig.find(p => p.id === Number(resp.pregunta_id));
        const opcionTexto = preguntaObj?.opciones?.[Number(resp.respuesta)] || resp.respuesta;
        csvRows.push(
          `"${i + 1}","${preguntaObj?.pregunta || `Pregunta ${resp.pregunta_id}`}","${opcionTexto}","${resp.contextos && resp.contextos.length > 0 ? resp.contextos.join(", ") : ""}"`
        );
      });
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formulario_${formulario.id}_reporte.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Sidebar />
      <div className="main-content-with-sidebar">
        {error ? (
          <p className="error">{error}</p>
        ) : !formulario ? (
          <p>Cargando...</p>
        ) : (
          <div className="formulario-card">
            <div className="evaluacion-titulo">
              <h2>Historia Clínica: {formulario.nombre_nino}</h2>
            </div>
            <div className="info-sections-row">
              <div className="section-card datos-paciente">
                <h3>Datos del paciente</h3>
                <p><strong>Nombre:</strong> {formulario.nombre_nino}</p>
                <p><strong>Edad:</strong> {formulario.edad}</p>
                <p><strong>Sexo:</strong> {formulario.sexo}</p>
                <p><strong>Cuidador principal:</strong> {formulario.cuidador_principal}</p>
                <p><strong>Parentesco:</strong> {formulario.parentesco}</p>
                <p><strong>Nacionalidad:</strong> {formulario.nacionalidad}</p>
                <p><strong>Contacto:</strong> {formulario.contacto}</p>
                <p><strong>Convivencia:</strong> {formulario.convivencia}</p>
                <p><strong>Hermanos:</strong> {formulario.hermanos}</p>
                <p><strong>Dificultades hermanos:</strong> {formulario.dificultades_hermanos}</p>
                <p><strong>Cuidador durante el día:</strong> {formulario.cuidador_dia}</p>
                {formulario.cuidador_dia_otro && <p><strong>Otro cuidador:</strong> {formulario.cuidador_dia_otro}</p>}
              </div>
              <div className="section-card embarazo-partos">
                <h3>Embarazo y parto</h3>
                <p><strong>Embarazo controlado:</strong> {formulario.embarazo_controlado}</p>
                <p><strong>Complicaciones:</strong> {Array.isArray(formulario.complicaciones) ? formulario.complicaciones.join(", ") : formulario.complicaciones}</p>
                {formulario.complicaciones_otro && <p><strong>Otra complicación:</strong> {formulario.complicaciones_otro}</p>}
                <p><strong>Embarazo planeado:</strong> {formulario.embarazo_planeado}</p>
                <p><strong>Tipo de parto:</strong> {formulario.tipo_parto}</p>
                <p><strong>Prematuro:</strong> {formulario.prematuro}</p>
                <p><strong>Hospitalización:</strong> {formulario.hospitalizacion}</p>
                <p><strong>Tiempo hospitalización:</strong> {formulario.tiempo_hospitalizacion}</p>
                <p><strong>Dificultad nacimiento:</strong> {formulario.dificultad_nacimiento}</p>
                {formulario.dificultad_nacimiento_detalle && <p><strong>Detalle dificultad:</strong> {formulario.dificultad_nacimiento_detalle}</p>}
              </div>
              <div className="section-card alimentacion-desarrollo">
                <h3>Alimentación y desarrollo</h3>
                <p><strong>Lactancia:</strong> {formulario.lactancia}</p>
                <p><strong>Dificultades alimentación:</strong> {formulario.dificultades_alimentacion}</p>
                {formulario.dificultades_alimentacion_desc && <p><strong>Detalle:</strong> {formulario.dificultades_alimentacion_desc}</p>}
                <p><strong>Temperamento:</strong> {formulario.temperamento}</p>
                <p><strong>Estimulación:</strong> {formulario.estimulacion}</p>
              </div>
            </div>
            {formulario.hitos &&
              <div className="section-card hitos-desarrollo">
                <h3>Hitos del desarrollo</h3>
                <div className="hitos">
                  {Object.entries(formulario.hitos).map(([hito, info]) => (
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
            }
            <div className="section-card evaluacion-detalles-expanded">
              <h3>Resultados de la Evaluación</h3>
              {!evaluacion ? (
                <p>Cargando evaluación...</p>
              ) : evaluacion?.error ? (
                <p className="error">{evaluacion.error}</p>
              ) : (
                <div className="evaluacion-respuestas-list">
                  {evaluacion.respuestas?.map((resp, i) => {
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
              )}
            </div>
            {/* --- BOTONES DE REPORTES --- */}
            <div style={{ textAlign: "right", marginTop: "2rem" }}>
              <button
                className="btn btn-warning me-2"
                onClick={handleGenerarCSV}
                disabled={!formulario}
              >
                Descargar reporte CSV
              </button>
              <button
                className="btn btn-danger"
                onClick={handleGenerarPDF}
                disabled={!formulario}
              >
                Descargar reporte PDF
              </button>
            </div>
            {/* --- FIN BOTONES DE REPORTES --- */}
          </div>
        )}
      </div>
    </>
  );
}