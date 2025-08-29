class EvaluacionDTO {
  constructor({ id, formularioId, fecha, respuestas }) {
    this.id = id;
    this.formularioId = formularioId;
    this.fecha = fecha; // Timestamp
    this.respuestas = respuestas || []; // Array de RespuestaDTO
  }
}

module.exports = EvaluacionDTO;
