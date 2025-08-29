import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/header";
import "./styles/Formulario.css";

// 🔹 RadioGroup reutilizable
const RadioGroup = ({ name, value, options, onChange }) => (
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

const Evaluacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: formularioId } = location.state || {};

  const [respuestas, setRespuestas] = useState({
    alimentacion: "", higiene: "", esfinteres: "", vestirse: "",
    juegoSocial: "", juegoSimbolico: "", relacionOtros: "", juegosGrupales: "",
    movimiento: "", motricidad: "", comprension: "", comunicacion: "",
    reaccion: "", controlEmociones: "", rutinas: "", sueno: "",
    cariñoTiempo: "", cambios: "",
  });

  const [contextos, setContextos] = useState({
    alimentacion: [], higiene: [], esfinteres: [], vestirse: [],
    juegoSocial: [], juegoSimbolico: [], relacionOtros: [], juegosGrupales: [],
    movimiento: [], motricidad: [], comprension: [], comunicacion: [],
    reaccion: [], controlEmociones: [], rutinas: [], sueno: [],
    cariñoTiempo: [], cambios: [],
  });

  const [puntajeTotal, setPuntajeTotal] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas({ ...respuestas, [name]: value });
  };

  const handleContextoChange = (nombre, valor, checked) => {
    setContextos(prev => {
      const arr = new Set(prev[nombre]);
      if (checked) arr.add(valor);
      else arr.delete(valor);
      return { ...prev, [nombre]: Array.from(arr) };
    });
  };

  const calculateScore = () => {
    return Object.values(respuestas).reduce((total, val) => total + (parseInt(val) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPuntaje = calculateScore();
    setPuntajeTotal(totalPuntaje); // 🔹 actualizar el estado para mostrar en pantalla

    if (!formularioId) {
      alert("Error: formularioId no disponible");
      return;
    }

    const payload = {
      formularioId,
      totalPuntaje,
      respuestas: Object.keys(respuestas).map((key, index) => ({
        pregunta_id: index + 1,
        respuesta: respuestas[key],
        puntaje: parseInt(respuestas[key]) || 0,
        contextos: contextos[key] || []
      }))
    };

    // 🔹 enviar al backend
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
        alert(`Evaluación guardada con ID: ${data.evaluacionId}`);
        navigate("/misformularios");
      } else {
        console.error("Error del servidor:", data);
        alert("Error guardando la evaluación");
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

  // Listado de contextos por ítem (se muestran solo si se elige la opción 2)
  const CONTEXTOS = {
    alimentacion: [
      "No ha tenido tiempo o no lo han dejado practicar solo/a.",
      "Tiene miedo a ensuciarse o derramar comida.",
      "Le cuesta sostener la cuchara o el tenedor.",
      "Siempre come viendo televisión o el celular.",
      "Falta comida o cubiertos apropiados.",
    ],
    higiene: [
      "No tiene horarios fijos para lavarse o peinarse.",
      "No le gusta el agua, el cepillo o el jabón.",
      "Se asusta o se enoja cuando lo(a) lavan o peinan.",
      "No hay suficiente agua, jabón o cepillos.",
      "Hay muchas personas a cargo o poco tiempo para ayudarlo(a).",
    ],
    esfinteres: [
      "No ha empezado el proceso de dejar el pañal.",
      "El baño no es cómodo, privado o accesible.",
      "Tiene miedo a caerse o sentarse solo/a.",
      "No hay rutina ni tiempo para enseñarle.",
      "En casa no hay agua suficiente o hay muchas distracciones.",
    ],
    vestirse: [
      "No se le permite intentarlo o se hace todo por el niño(a).",
      "La ropa es difícil de poner o sacar.",
      "Falta de fuerza o le cuesta mover bien las manos y los brazos.",
      "Le cuesta concentrarse o seguir pasos para vestirse.",
    ],
    juegoSocial: [
      "No tiene hermanos con quien jugar.",
      "No hay juguetes o espacio suficiente para jugar.",
      "Ve mucha televisión o celular.",
      "En casa no hay mucho tiempo para jugar juntos.",
      "Está cansado(a), triste o distraído(a).",
    ],
    juegoSimbolico: [
      "No ve a nadie jugar o imitar para copiar.",
      "Pasa mucho tiempo solo(a) o frente a una pantalla.",
      "Le cuesta ver o copiar lo que hacen otros niños.",
      "No hay suficiente tiempo para jugar en casa.",
    ],
    relacionOtros: [
      "No hay otros niños cerca.",
      "Siempre está solo(a), no juega con otros.",
      "Aún está aprendiendo a hablar.",
      "En casa hay problemas que lo hacen sentir nervioso(a) o inseguro(a).",
    ],
    juegosGrupales: [
      "Se pone tímido(a) o tiene miedo.",
      "No se siente cómodo(a) con ruidos o en grupo.",
      "Prefiere jugar solo o ver televisión/celular.",
      "No hay tiempo o espacio para este tipo de juegos.",
    ],
    movimiento: [
      "No tiene espacio seguro para jugar y moverse.",
      "Está mucho tiempo sentado(a) o viendo televisión/celular.",
      "Puede tener algún problema físico que requiere ayuda.",
      "No hay muchos juguetes o espacio para moverse.",
    ],
    motricidad: [
      "No ha tenido cosas para agarrar o manipular.",
      "Sus manos son débiles o le cuesta mover bien las manos.",
      "No se le ha animado a usar las manos para manipular cosas.",
      "No hay muchas cosas para que explore.",
    ],
    comprension: [
      "No se le habla ni enseña mucho en casa.",
      "Puede no oír bien.",
      "En casa hay mucho ruido o distracciones.",
      "No le han enseñado órdenes fáciles.",
    ],
    comunicacion: [
      "No le hablan suficiente o no lo entienden.",
      "Ve mucho televisión o celular sin que jueguen con el niño(a).",
      "Puede tener problemas para oír o hablar.",
      "El ambiente en casa es muy ruidoso o estresante.",
    ],
    reaccion: [
      "El ambiente es ruidoso o muy movido.",
      "No le gustan algunos ruidos, luces o texturas al tocar.",
      "Se siente incómodo(a) con facilidad.",
      "Se pone inquieto(a) o nervioso(a) en algunas situaciones.",
    ],
    controlEmociones: [
      "No sabe cómo mostrar lo que siente.",
      "Los horarios o actividades cambian mucho.",
      "En casa hay problemas o preocupaciones.",
      "No siempre recibe ayuda o atención.",
    ],
    rutinas: [
      "No hay horarios claros en casa.",
      "Las actividades familiares o trabajo cambian mucho.",
      "Está al cuidado de varias personas y cada horario es diferente.",
      "No hay tiempo para organizar su día.",
    ],
    sueno: [
      "Hay mucho ruido o personas compartiendo habitación.",
      "Ve televisión o el celular antes de dormir.",
      "No tiene cama cómoda o lugar seguro para dormir.",
      "Tiene enfermedades o molestias que dificultan dormir.",
    ],
    cariñoTiempo: [
      "Usted o los cuidadores trabajan mucho y están ocupados.",
      "Hay problemas de dinero o preocupaciones.",
      "Lo cuidan varias personas o no hay tiempo suficiente.",
      "No hay ayuda de familia o vecinos.",
      "No saben cómo enseñarle o jugar con su niño(a).",
    ],
    cambios: [
      "Le hace falta sentirse seguro(a) cuando pasa algo nuevo.",
      "Los horarios, lugares o personas cambian mucho.",
      "No le explican antes lo que va a pasar.",
      "En casa hay estrés, problemas o discusiones.",
    ],
  };

  const renderContextos = (nombreClave) => {
    if (respuestas[nombreClave] !== "2") return null;
    return (
      <div className="contextos-adicionales">
        <p className="contextos-titulo">Contextos asociados (marque los que apliquen):</p>
        <div className="checkbox-group">
          {CONTEXTOS[nombreClave].map(txt => (
            <label key={txt}>
              <input
                type="checkbox"
                checked={contextos[nombreClave]?.includes(txt) || false}
                onChange={(e) => handleContextoChange(nombreClave, txt, e.target.checked)}
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
          {/* ===================== SECCIÓN 1: Actividades Básicas ===================== */}
          <fieldset style={{ backgroundColor: "#f0f8ff" }}>
            <legend>ÁREA: Actividades Básicas de la vida diaria</legend>

            <label>1. Alimentación — ¿Su niño(a) come solo(a) con cuchara, tenedor o con sus manos?</label>
            <RadioGroup
              name="alimentacion"
              value={respuestas.alimentacion}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, come solo(a) sin problemas" },
                { value: "1", label: "Come solo(a), pero con ayuda a veces" },
                { value: "2", label: "No come solo(a), necesita que lo alimenten" },
              ]}
            />
            {renderContextos("alimentacion")}

            <label>2. Higiene personal — ¿Se lava los dientes, las manos o se peina (aunque necesite ayuda)?</label>
            <RadioGroup
              name="higiene"
              value={respuestas.higiene}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, lo hace solo/a o cuando se lo recuerdan" },
                { value: "1", label: "A veces lo hace, pero necesita ayuda" },
                { value: "2", label: "No lo hace o no quiere hacerlo" },
              ]}
            />
            {renderContextos("higiene")}

            <label>3. Control de esfínteres (día) — ¿Avisa o ya no usa pañal durante el día?</label>
            <RadioGroup
              name="esfinteres"
              value={respuestas.esfinteres}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, avisa o va al baño solo(a)" },
                { value: "1", label: "A veces avisa o necesita ayuda" },
                { value: "2", label: "No controla aún / no avisa" },
              ]}
            />
            {renderContextos("esfinteres")}

            <label>4. Vestirse — ¿Se viste o se quita la ropa solo/a?</label>
            <RadioGroup
              name="vestirse"
              value={respuestas.vestirse}
              onChange={handleChange}
              options={[
                { value: "0", label: "Lo hace solo/a sin ayuda" },
                { value: "1", label: "Lo hace con algo de ayuda" },
                { value: "2", label: "No lo hace, necesita mucha ayuda" },
              ]}
            />
            {renderContextos("vestirse")}
          </fieldset>

          {/* ===================== SECCIÓN 2: Juego y Participación ===================== */}
          <fieldset style={{ backgroundColor: "#e6ffe6" }}>
            <legend>ÁREA: Juego y Participación Social</legend>

            <label>5. Juego y Participación Social — ¿Le gusta jugar o descubrir cosas nuevas?</label>
            <RadioGroup
              name="juegoSocial"
              value={respuestas.juegoSocial}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, juega solo/a y con otras personas" },
                { value: "1", label: "Juega un rato, pero se distrae rápido" },
                { value: "2", label: "No se interesa mucho por jugar" },
              ]}
            />
            {renderContextos("juegoSocial")}

            <label>6. Juego simbólico o de imitación — ¿Copia acciones como aplaudir, cocinar o hablar por teléfono?</label>
            <RadioGroup
              name="juegoSimbolico"
              value={respuestas.juegoSimbolico}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, copia fácilmente lo que ve" },
                { value: "1", label: "A veces lo hace, si se le anima" },
                { value: "2", label: "No lo hace o no parece entender cómo hacerlo" },
              ]}
            />
            {renderContextos("juegoSimbolico")}

            <label>7. Relación con otros — ¿Se relaciona con otros niños o responde cuando le hablan?</label>
            <RadioGroup
              name="relacionOtros"
              value={respuestas.relacionOtros}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, se lleva bien con otros" },
                { value: "1", label: "A veces le cuesta un poco" },
                { value: "2", label: "No suele relacionarse o no responde a otros" },
              ]}
            />
            {renderContextos("relacionOtros")}

            <label>8. Participa en juegos grupales o en familia — ¿Le gusta participar en juegos con canciones o cuentos?</label>
            <RadioGroup
              name="juegosGrupales"
              value={respuestas.juegosGrupales}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, le gusta mucho y participa con entusiasmo" },
                { value: "1", label: "A veces participa, si se lo anima" },
                { value: "2", label: "Se aparta o no le gusta participar" },
              ]}
            />
            {renderContextos("juegosGrupales")}
          </fieldset>

          {/* ===================== SECCIÓN 3: Habilidades del desempeño ===================== */}
          <fieldset style={{ backgroundColor: "#fff5e6" }}>
            <legend>ÁREA: Habilidades del desempeño</legend>

            <label>9. Movimiento general — ¿Corre, se sube a cosas o salta sin problema?</label>
            <RadioGroup
              name="movimiento"
              value={respuestas.movimiento}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, se mueve bien y sin problemas" },
                { value: "1", label: "A veces se cansa o le cuesta moverse" },
                { value: "2", label: "Le cuesta mucho moverse o no lo hace" },
              ]}
            />
            {renderContextos("movimiento")}

            <label>10. Agarre y pinzas — ¿Puede tomar objetos pequeños usando sus dedos?</label>
            <RadioGroup
              name="motricidad"
              value={respuestas.motricidad}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, toma objetos pequeños con sus dedos fácilmente" },
                { value: "1", label: "Lo intenta, pero a veces se le caen o le cuesta" },
                { value: "2", label: "No puede tomar objetos pequeños con sus dedos" },
              ]}
            />
            {renderContextos("motricidad")}

            <label>11. Comprensión de instrucciones — ¿Entiende y responde a órdenes sencillas?</label>
            <RadioGroup
              name="comprension"
              value={respuestas.comprension}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, entiende y hace lo que le piden" },
                { value: "1", label: "A veces entiende, necesita que le repitan" },
                { value: "2", label: "No entiende o no hace caso a lo que se le dice" },
              ]}
            />
            {renderContextos("comprension")}

            <label>12. Comunicación para expresar necesidades — ¿Se comunica con palabras, señas o sonidos?</label>
            <RadioGroup
              name="comunicacion"
              value={respuestas.comunicacion}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, se comunica bien" },
                { value: "1", label: "Se comunica, pero a veces no se le entiende" },
                { value: "2", label: "No se comunica o es muy difícil entenderlo" },
              ]}
            />
            {renderContextos("comunicacion")}

            <label>13. Reacción ante sensaciones — ¿Se asusta con ruidos, luces o ciertas telas/comidas?</label>
            <RadioGroup
              name="reaccion"
              value={respuestas.reaccion}
              onChange={handleChange}
              options={[
                { value: "0", label: "No, reacciona bien a estas cosas" },
                { value: "1", label: "A veces se siente incómodo(a)" },
                { value: "2", label: "Se altera mucho o llora con facilidad" },
              ]}
            />
            {renderContextos("reaccion")}

            <label>14. Control de emociones y comportamiento — ¿Hace berrinches o le cuesta calmarse?</label>
            <RadioGroup
              name="controlEmociones"
              value={respuestas.controlEmociones}
              onChange={handleChange}
              options={[
                { value: "0", label: "No, casi nunca" },
                { value: "1", label: "A veces se enoja, pero se calma pronto" },
                { value: "2", label: "Se enoja mucho o le cuesta calmarse" },
              ]}
            />
            {renderContextos("controlEmociones")}

            <label>15. Rutinas — ¿Tiene horarios fijos para comer, jugar y dormir?</label>
            <RadioGroup
              name="rutinas"
              value={respuestas.rutinas}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, tiene horarios claros" },
                { value: "1", label: "A veces, pero no siempre se respetan" },
                { value: "2", label: "No tiene horarios fijos o cambian mucho" },
              ]}
            />
            {renderContextos("rutinas")}

            <label>16. Sueño — ¿Duerme bien por las noches?</label>
            <RadioGroup
              name="sueno"
              value={respuestas.sueno}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, duerme bien y de corrido" },
                { value: "1", label: "A veces se despierta o le cuesta dormirse" },
                { value: "2", label: "Duerme poco, se despierta mucho o no descansa" },
              ]}
            />
            {renderContextos("sueno")}

            <label>17. Sobre el cariño y el tiempo que recibe en casa — ¿Pasan tiempo para jugar, hablar o enseñarle?</label>
            <RadioGroup
              name="cariñoTiempo"
              value={respuestas.cariñoTiempo}
              onChange={handleChange}
              options={[
                { value: "0", label: "Sí, pasamos tiempo juntos con atención y cariño" },
                { value: "1", label: "A veces lo hacemos, pero no tanto como quisiéramos" },
                { value: "2", label: "Casi no tenemos tiempo o no hay quién le dedique ese espacio" },
              ]}
            />
            {renderContextos("cariñoTiempo")}

            <label>18. Sobre cómo reacciona a los cambios — ¿Qué tal se adapta a visitas, salidas o cambios en el día?</label>
            <RadioGroup
              name="cambios"
              value={respuestas.cambios}
              onChange={handleChange}
              options={[
                { value: "0", label: "Se adapta bien y no se altera" },
                { value: "1", label: "A veces se pone nervioso(a), pero logra adaptarse" },
                { value: "2", label: "Se altera mucho, llora o le cuesta mucho calmarse" },
              ]}
            />
            {renderContextos("cambios")}
          </fieldset>

          {/* ===================== BOTONES ===================== */}
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
