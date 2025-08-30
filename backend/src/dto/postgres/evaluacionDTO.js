class EvaluacionDTO {
    constructor({ id, formulario_id, user_id, fecha, respuestas}) {
        this.id = id;
        this.formulario_id = formulario_id;
        this.user_id = user_id;
        this.fecha = fecha;
        this.respuestas = respuestas;
    }
}

module.exports = EvaluacionDTO;