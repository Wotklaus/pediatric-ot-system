class ReporteEvaluacionDTO {
    constructor({
        nombreNino,
        fechaNacimiento,
        sexo,
        fechaEvaluacion,
        puntaje,
        recomendacion
    }) {
        this.nombreNino = nombreNino;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.fechaEvaluacion = fechaEvaluacion;
        this.puntaje = puntaje;
        this.recomendacion = recomendacion;
    }
}

module.exports = ReporteEvaluacionDTO;