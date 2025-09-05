class EvaluacionDTO {
    constructor({ id, formulario_id, user_id, fecha, respuestas, puntaje_total, recomendacion }) {
        this.id = id;
        this.formulario_id = formulario_id;
        this.user_id = user_id;
        this.fecha = fecha;
        this.respuestas = respuestas;
        this.puntaje_total = puntaje_total;
        this.recomendacion = recomendacion;
    }
}

module.exports = EvaluacionDTO;