import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// 🔹 CheckboxGroup reutilizable
const CheckboxGroup = ({ name, values, options, onChange, dataGroup }) => (
    <div className="checkbox-group">
        {options.map((opt) => (
            <label key={opt.value}>
                <input
                    type="checkbox"
                    name={name}
                    value={opt.value}
                    checked={values.includes(opt.value)}
                    onChange={onChange}
                    data-group={dataGroup}
                />
                {opt.label}
            </label>
        ))}
    </div>
);

const Formulario = () => {
    const [formData, setFormData] = useState({
        // Sección 1
        nombre: "",
        edad: "",
        fechaNacimiento: "",
        sexo: "",
        cuidador: "",
        parentesco: "",
        nacionalidad: "",
        contacto: "",
        convivencia: "",
        hermanos: "",
        dificultadesHermanos: "",
        cuidadorDia: "",
        cuidadorDiaOtro: "",

        // Sección 2
        embarazoControlado: "",
        complicaciones: [],
        complicacionesOtro: "",
        embarazoPlaneado: "",
        tipoParto: "",
        prematuro: "",
        hospitalizacion: "",
        tiempoHospitalizacion: "",
        dificultadNacimiento: "",
        dificultadNacimientoDetalle: "",

        // Sección 3
        lactancia: "",
        dificultadesAlimentacion: "",
        dificultadesAlimentacionDesc: "",
        temperamento: "",
        estimulacion: "",

        // Sección 4
        hitos: {
            cabeza: { edad: "", esperado: "", razon: [] },
            sentado: { edad: "", esperado: "", razon: [] },
            gateo: { edad: "", esperado: "", razon: [] },
            caminar: { edad: "", esperado: "", razon: [] },
            primerasPalabras: { edad: "", esperado: "", razon: [] },
            irAlBaño: { edad: "", esperado: "", razon: [] },
        },
    });

    const [mensaje, setMensaje] = useState("");        // Texto del mensaje
    const [tipoMensaje, setTipoMensaje] = useState(""); // "error" o "exito"

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked, dataset } = e.target;

        // Manejar checkboxes de complicaciones
        if (type === "checkbox" && dataset.group === "complicaciones") {
            const updated = checked
                ? [...formData.complicaciones, value]
                : formData.complicaciones.filter((item) => item !== value);
            setFormData({ ...formData, complicaciones: updated });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleHitoChange = (e, hito, campo) => {
        const { value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            hitos: {
                ...prev.hitos,
                [hito]: {
                    ...prev.hitos[hito],
                    [campo]:
                        type === "checkbox"
                            ? checked
                                ? [...prev.hitos[hito][campo], value]
                                : prev.hitos[hito][campo].filter((v) => v !== value)
                            : value,
                },
            },
        }));
    };

    // 🔹 Validación básica antes del envío
    const validateForm = () => {
        if (!formData.nombre.trim()) return "El nombre es obligatorio";
        if (!formData.edad || formData.edad <= 0) return "La edad es obligatoria y debe ser válida";
        if (!formData.fechaNacimiento) return "La fecha de nacimiento es obligatoria";
        if (!formData.sexo) return "Debe seleccionar el sexo";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMsg = validateForm();
        if (errorMsg) {
            setMensaje(errorMsg);
            setTipoMensaje("error");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/formularios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje("Formulario guardado correctamente ✅");
                setTipoMensaje("exito");

                const formularioId = data.id; // <-- usa 'id' minúscula
                setTimeout(() => navigate("/evaluacion", { state: { formularioId } }), 2000);
            } else {
                setMensaje("Error al guardar: " + data.error);
                setTipoMensaje("error");
            }
        } catch (error) {
            setMensaje("Error al enviar formulario: " + error.message);
            setTipoMensaje("error");
        }
    };

    const handleCancel = () => {
        navigate("/customer");
    };

    return (
        <div className="formulario-page">
            <Header />

            <div className="anamnesis-container">
                <h2>EVALUACIÓN PERFIL OCUPACIONAL</h2>
                <h2>I: Anamnesis y Antecedentes del Desarrollo</h2>

                <form onSubmit={handleSubmit} className="anamnesis-form">
                    {/* ===================== SECCIÓN 1 ===================== */}
                    <fieldset>
                        <legend>1. Información general</legend>
                        <label>Nombre del niño(a):</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

                        <label>Edad (meses/años):</label>
                        <input type="number" name="edad" value={formData.edad} onChange={handleChange} />

                        <label>Fecha de nacimiento:</label>
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />

                        <label>Sexo:</label>
                        <RadioGroup
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleChange}
                            options={[
                                { value: "masculino", label: "Masculino" },
                                { value: "femenino", label: "Femenino" },
                            ]}
                        />

                        <label>Cuidador principal:</label>
                        <input type="text" name="cuidador" value={formData.cuidador} onChange={handleChange} />

                        <label>Parentesco:</label>
                        <input type="text" name="parentesco" value={formData.parentesco} onChange={handleChange} />

                        <label>Nacionalidad:</label>
                        <input type="text" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} />

                        <label>Número de contacto:</label>
                        <input type="tel" name="contacto" value={formData.contacto} onChange={handleChange} />

                        <label>¿Con quién vive el niño(a) actualmente?</label>
                        <input type="text" name="convivencia" value={formData.convivencia} onChange={handleChange} />

                        <label>¿Tiene hermanos?</label>
                        <RadioGroup
                            name="hermanos"
                            value={formData.hermanos}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "no", label: "No" },
                            ]}
                        />
                        {formData.hermanos === "sí" && (
                            <>
                                <label>¿Alguno tiene o tuvo dificultades del desarrollo?</label>
                                <RadioGroup
                                    name="dificultadesHermanos"
                                    value={formData.dificultadesHermanos}
                                    onChange={handleChange}
                                    options={[
                                        { value: "sí", label: "Sí" },
                                        { value: "no", label: "No" },
                                    ]}
                                />
                            </>
                        )}

                        <label>¿Quién lo cuida durante el día?</label>
                        <RadioGroup
                            name="cuidadorDia"
                            value={formData.cuidadorDia}
                            onChange={handleChange}
                            options={[
                                { value: "madre", label: "Madre" },
                                { value: "padre", label: "Padre" },
                                { value: "otro", label: "Otro" },
                            ]}
                        />
                        {formData.cuidadorDia === "otro" && (
                            <input
                                type="text"
                                name="cuidadorDiaOtro"
                                placeholder="Especifique"
                                value={formData.cuidadorDiaOtro}
                                onChange={handleChange}
                            />
                        )}
                    </fieldset>

                    {/* ===================== SECCIÓN 2 ===================== */}
                    <fieldset>
                        <legend>2. Embarazo y nacimiento</legend>

                        <label>¿Durante el embarazo tuvo chequeos con un médico o enfermera?</label>
                        <RadioGroup
                            name="embarazoControlado"
                            value={formData.embarazoControlado}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "parcialmente", label: "Parcialmente" },
                                { value: "no", label: "No" },
                            ]}
                        />

                        <label>¿Hubo complicaciones durante el embarazo?</label>
                        <CheckboxGroup
                            name="complicaciones"
                            values={formData.complicaciones}
                            onChange={handleChange}
                            dataGroup="complicaciones"
                            options={[
                                { value: "Infecciones", label: "Infecciones" },
                                { value: "Sangrados", label: "Sangrados" },
                                { value: "Medicación", label: "Medicación" },
                                { value: "Riesgo de aborto", label: "Riesgo de aborto" },
                                { value: "Otro", label: "Otro" },
                            ]}
                        />
                        {formData.complicaciones.includes("Otro") && (
                            <input
                                type="text"
                                name="complicacionesOtro"
                                placeholder="Describa otra complicación"
                                value={formData.complicacionesOtro}
                                onChange={handleChange}
                            />
                        )}

                        <label>¿Fue un embarazo planeado?</label>
                        <RadioGroup
                            name="embarazoPlaneado"
                            value={formData.embarazoPlaneado}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "no", label: "No" },
                            ]}
                        />

                        <label>Tipo de parto:</label>
                        <RadioGroup
                            name="tipoParto"
                            value={formData.tipoParto}
                            onChange={handleChange}
                            options={[
                                { value: "natural", label: "Natural" },
                                { value: "cesarea", label: "Cesárea" },
                                { value: "instrumental", label: "Con ayuda de instrumentos" },
                            ]}
                        />

                        <label>¿El bebé nació antes de los 9 meses (prematuro)?</label>
                        <RadioGroup
                            name="prematuro"
                            value={formData.prematuro}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "no", label: "No" },
                            ]}
                        />

                        <label>¿Requirió incubadora u hospitalización al nacer?</label>
                        <RadioGroup
                            name="hospitalizacion"
                            value={formData.hospitalizacion}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "no", label: "No" },
                            ]}
                        />
                        {formData.hospitalizacion === "sí" && (
                            <input
                                type="text"
                                name="tiempoHospitalizacion"
                                placeholder="¿Cuánto tiempo?"
                                value={formData.tiempoHospitalizacion}
                                onChange={handleChange}
                            />
                        )}

                        <label>¿Tuvo alguna dificultad al nacer (llanto débil, no respiraba, color morado, etc.)?</label>
                        <RadioGroup
                            name="dificultadNacimiento"
                            value={formData.dificultadNacimiento}
                            onChange={handleChange}
                            options={[
                                { value: "no", label: "No" },
                                { value: "sí", label: "Sí, describa" },
                            ]}
                        />
                        {formData.dificultadNacimiento === "sí" && (
                            <input
                                type="text"
                                name="dificultadNacimientoDetalle"
                                placeholder="Describa la dificultad"
                                value={formData.dificultadNacimientoDetalle}
                                onChange={handleChange}
                            />
                        )}
                    </fieldset>

                    {/* ===================== SECCIÓN 3 ===================== */}
                    <fieldset>
                        <legend>3. Alimentación y cuidados tempranos</legend>

                        <label>¿Su bebé tomó solo leche materna durante los primeros 6 meses, sin otros alimentos ni leche de tarro?</label>
                        <RadioGroup
                            name="lactancia"
                            value={formData.lactancia}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "un_poco", label: "Un poco" },
                                { value: "no", label: "No" },
                            ]}
                        />

                        <label>¿Su bebé tuvo problemas para agarrarse al pecho, tragar o alimentarse?</label>
                        <RadioGroup
                            name="dificultadesAlimentacion"
                            value={formData.dificultadesAlimentacion}
                            onChange={handleChange}
                            options={[
                                { value: "sí", label: "Sí" },
                                { value: "no", label: "No" },
                            ]}
                        />
                        {formData.dificultadesAlimentacion === "sí" && (
                            <input
                                type="text"
                                name="dificultadesAlimentacionDesc"
                                placeholder="Describa:"
                                value={formData.dificultadesAlimentacionDesc}
                                onChange={handleChange}
                            />
                        )}

                        <label>¿Su bebé era tranquilo o lloraba mucho?</label>
                        <RadioGroup
                            name="temperamento"
                            value={formData.temperamento}
                            onChange={handleChange}
                            options={[
                                { value: "tranquilo", label: "Tranquilo" },
                                { value: "dificultad", label: "Con dificultad para dormir o calmarse" },
                                { value: "irritable", label: "Lloraba mucho / se enojaba con facilidad" },
                            ]}
                        />

                        <label>En casa, ¿le hacían juegos, le hablaban, lo acariciaban o le miraban a los ojos?</label>
                        <RadioGroup
                            name="estimulacion"
                            value={formData.estimulacion}
                            onChange={handleChange}
                            options={[
                                { value: "seguido", label: "Sí, seguido" },
                                { value: "ocasional", label: "A veces" },
                                { value: "poca", label: "Muy poco o nada" },
                            ]}
                        />
                    </fieldset>

                    {/* ===================== SECCIÓN 4 ===================== */}
                    <fieldset>
                        <legend>4. Hitos del desarrollo</legend>
                        {Object.keys(formData.hitos).map((hito) => {
                            const labels = {
                                cabeza: "sostuvo bien la cabeza sin ayuda",
                                sentado: "se sentó solo/a sin caerse",
                                gateo: "empezó a gatear",
                                caminar: "caminó solo/a sin ayuda",
                                primerasPalabras: "dijo sus primeras palabras",
                                irAlBaño: "empezó a avisar o ir solo/a al baño durante el día",
                            };
                            const causas = {
                                cabeza: [
                                    ["prematuro", "Nació antes de tiempo"],
                                    ["muchoAcostado", "Estaba mucho tiempo acostado"],
                                    ["noBocaAbajo", "No lo poníamos boca abajo"],
                                ],
                                sentado: [
                                    ["noFuerza", "No tenía fuerza"],
                                    ["loCargaban", "Lo cargaban mucho"],
                                    ["noJugaba", "No lo dejábamos jugar en el piso"],
                                ],
                                gateo: [
                                    ["siempreCuna", "Pasaba casi siempre en la cuna o coche"],
                                    ["noPiso", "No le gustaba estar en el piso"],
                                    ["noAnimaba", "No se le animaba a moverse"],
                                ],
                                caminar: [
                                    ["miedoCaminar", "Tuvo miedo de caminar"],
                                    ["usoAndador", "Usó mucho andador o coche"],
                                    ["bajoPeso", "Nació con bajo peso o débil"],
                                ],
                                primerasPalabras: [
                                    ["muchaTV", "Veía mucha TV"],
                                    ["pocaAtencion", "No se hablaba mucho en casa"],
                                    ["problemasAuditivos", "Problemas de audición"],
                                ],
                                irAlBaño: [
                                    ["miedoBano", "Tenía miedo al baño"],
                                    ["noEnsenio", "No le enseñó a tiempo"],
                                    ["dificilInstrucciones", "Le cuesta entender instrucciones"],
                                ],
                            };
                            return (
                                <div key={hito} className="hito-section">
                                    <label>¿A qué edad {labels[hito]}?</label>
                                    <input
                                        type="text"
                                        value={formData.hitos[hito].edad}
                                        onChange={(e) => handleHitoChange(e, hito, "edad")}
                                        placeholder="Edad (meses o años)"
                                    />

                                    <label>¿Fue dentro de lo esperado?</label>
                                    <RadioGroup
                                        name={`esperado-${hito}`}
                                        value={formData.hitos[hito].esperado}
                                        onChange={(e) => handleHitoChange(e, hito, "esperado")}
                                        options={[
                                            { value: "sí", label: "Sí" },
                                            { value: "no", label: "No" },
                                            { value: "noRecuerda", label: "No recuerda" },
                                        ]}
                                    />

                                    {formData.hitos[hito].esperado === "no" && (
                                        <>
                                            <label>Razón si no fue esperado:</label>
                                            <CheckboxGroup
                                                name={`razon-${hito}`}
                                                values={formData.hitos[hito].razon}
                                                onChange={(e) => handleHitoChange(e, hito, "razon")}
                                                options={causas[hito].map(([value, label]) => ({ value, label }))}
                                            />
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </fieldset>

                    {/* --------------------- Mensaje --------------------- */}
                    {mensaje && (
                        <div className={`toast ${tipoMensaje}`}>
                            {mensaje}
                        </div>
                    )}

                    {/* ===================== BOTONES ===================== */}
                    <div className="button-group">
                        <button type="submit" className="submit-button">
                            Continuar
                        </button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default Formulario;
