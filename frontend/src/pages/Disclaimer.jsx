import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/sidebar";
import './styles/Disclaimer.css';

const Disclaimer = () => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    const handleStart = () => {
        if (acceptedTerms) {
            navigate("/formulario");
        } else {
            alert("Por favor acepta los términos y condiciones antes de continuar.");
        }
    };

    const handleCancel = () => {
        navigate("/customer");
    };

    return (
        <div className="disclaimer-layout">
            <Sidebar />
            <div className="disclaimer-content">
                <div className="disclaimer-section">
                    <h2 className="h2">Directrices generales</h2>
                    <p>
                        La participación en esta evaluación es voluntaria. Al responder, el cuidador acepta y brinda su consentimiento para que la información obtenida sea utilizada con fines de valoración clínica, seguimiento del desarrollo y recomendaciones terapéuticas.
                    </p>
                    <h3>Recomendaciones</h3>
                    <ul>
                        <li>Leer cada pregunta de manera pausada y comprensible.</li>
                        <li>Responda de manera clara y sincera, según lo que observe en su niño(a).</li>
                        <li>Complementar con observación clínica y anotar observaciones relevantes.</li>
                    </ul>
                    <label className="disclaimer-terms-label">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        Acepto los términos y condiciones.
                    </label>
                    <div className="disclaimer-buttons">
                        <button
                            className="disclaimer-btn disclaimer-btn-primary"
                            onClick={handleStart}
                            disabled={!acceptedTerms}
                        >
                            Iniciar evaluación
                        </button>
                        <button
                            className="disclaimer-btn disclaimer-btn-danger"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;