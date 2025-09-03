import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/sidebar"; // Usar el Sidebar como en Customer
import './styles/Disclaimer.css';

const Disclaimer = () => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    // Ir al formulario solo si acepta los términos
    const handleStart = () => {
        if (acceptedTerms) {
            navigate("/formulario");
        } else {
            alert("Por favor acepta los términos y condiciones antes de continuar.");
        }
    };

    // Cancelar y regresar a la vista de Customer
    const handleCancel = () => {
        navigate("/customer");
    };

    return (
        <div className="customer-layout"> {/* Respeta el layout con sidebar */}
            <Sidebar /> {/* Sidebar como navegación lateral */}

            {/* Contenido principal a la derecha del sidebar */}
            <div className="customer-content">
                <section className="featu-section" id="disclaimer">
                    <div className="container">
                        <br />
                        <h2>Directrices generales</h2>
                        <br />

                        <p>
                            La participación en esta evaluación es voluntaria. Al responder, el cuidador acepta y brinda su consentimiento para que la información obtenida sea utilizada con fines de valoración clínica, seguimiento del desarrollo y recomendaciones terapéuticas.
                        </p>
                        <br />
                        <h3>Recomendaciones</h3>
                        <br />
                        <p>
                            • Leer cada pregunta de manera pausada y comprensible.<br />
                            • Responda de manera clara y sincera, según lo que observe en su niño(a).<br />
                            • Complementar con observación clínica y anotar observaciones relevantes.
                        </p>
                        <br /><br />
                        <label className="terms-label">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                            />
                            Acepto los términos y condiciones.
                        </label>
                        <br />

                        <div className="disclaimer-buttons">
                            <button
                                className="ctaa-button"
                                onClick={handleStart}
                                disabled={!acceptedTerms}
                                style={{
                                    opacity: acceptedTerms ? 1 : 0.6,
                                    cursor: acceptedTerms ? 'pointer' : 'not-allowed',
                                    marginBottom: '10px',
                                    width: '200px'
                                }}
                            >
                                Iniciar evaluación
                            </button>

                            <button
                                className="ctaa-button"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: '#e31414d7',
                                    color: '#ffffffff',
                                    cursor: 'pointer',
                                    width: '200px'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Disclaimer;