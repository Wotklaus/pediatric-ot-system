class RespuestaDTO {
  constructor({ id, evaluacionId, preguntaId, respuesta, puntaje }) {
    this.id = id;
    this.evaluacionId = evaluacionId;
    this.preguntaId = preguntaId;
    this.respuesta = respuesta;
    this.puntaje = puntaje; // 0, 1 o 2
  }
}

module.exports = RespuestaDTO;
