class EvaluacionDTO {
    constructor({
        id,
        formulario_id,
        nombre_nino,         // <-- El nombre del niño viene del JOIN con formularios. 
        user_id,
        fecha,
        respuestas,
        puntaje_total,
        recomendacion
    }) {
        this.id = id;
        this.formulario_id = formulario_id;
        this.nombre_nino = nombre_nino; // <-- Campo para mostrar en el admin/table
        this.user_id = user_id;
        this.fecha = fecha;
        this.respuestas = respuestas;
        this.puntaje_total = puntaje_total;
        this.recomendacion = recomendacion;
    }
}

module.exports = EvaluacionDTO;