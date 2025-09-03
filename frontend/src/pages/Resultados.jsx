import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';


const Resultado = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evaluacion, setEvaluacion] = useState(null);

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/postgres/evaluaciones/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setEvaluacion(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener evaluación:', error);
        setLoading(false);
      }
    };

    fetchEvaluacion();
  }, [id]);

  const getNivelRiesgo = (puntaje) => {
    if (puntaje <= 7) return { nivel: 'Bajo', color: 'success', texto: 'Desarrollo adecuado, no se requiere intervención inmediata.' };
    if (puntaje <= 15) return { nivel: 'Medio', color: 'warning', texto: 'Se recomienda seguimiento y acompañamiento.' };
    return { nivel: 'Alto', color: 'error', texto: 'Es necesaria intervención en Terapia Ocupacional.' };
  };

  const getRecomendaciones = (nivel) => {
    const recomendaciones = {
      Bajo: [
        "Continuar con las actividades cotidianas que favorecen el desarrollo",
        "Mantener rutinas establecidas y hábitos saludables",
        "Realizar seguimiento periódico del desarrollo"
      ],
      Medio: [
        "Establecer rutinas más estructuradas para las actividades diarias",
        "Implementar actividades específicas para las áreas que necesitan atención",
        "Considerar una evaluación profesional para las áreas de preocupación",
        "Mantener comunicación constante con educadores y cuidadores"
      ],
      Alto: [
        "Buscar evaluación profesional en Terapia Ocupacional",
        "Implementar plan de intervención temprana",
        "Establecer metas específicas para cada área de desarrollo",
        "Mantener seguimiento cercano con profesionales de la salud",
        "Adaptar el entorno para favorecer el desarrollo y participación"
      ]
    };

    return recomendaciones[nivel] || [];
  };

  if (loading) {
    return (
      <div>
        <Header />
        <Container className="loading-container">
          <Typography>Cargando resultados...</Typography>
        </Container>
      </div>
    );
  }

  const riesgo = getNivelRiesgo(evaluacion.puntajeTotal);

  return (
    <div className="resultado-page">
      <Header />
      <Container maxWidth="md" className="resultado-container">
        <Paper elevation={3} className="resultado-paper">
          <Box className="actions-top">
            <IconButton onClick={() => navigate('/misformularios')} title="Volver">
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={() => navigate('/')} title="Inicio">
              <HomeIcon />
            </IconButton>
          </Box>

          <Typography variant="h4" className="titulo-principal">
            Resultados de la Evaluación
          </Typography>
          
          <Card className="puntaje-card">
            <Typography variant="h5">
              Puntaje Total: {evaluacion.puntajeTotal}
            </Typography>
            <Chip 
              label={`Nivel: ${riesgo.nivel}`}
              color={riesgo.color}
              size="large"
              className="nivel-chip"
            />
            <Typography variant="body1" className="interpretacion">
              {riesgo.texto}
            </Typography>
          </Card>

          <Divider className="divider" />

          <Box className="recomendaciones-section">
            <Typography variant="h6">
              Recomendaciones:
            </Typography>
            <ul className="recomendaciones-list">
              {getRecomendaciones(riesgo.nivel).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </Box>

          <Box className="actions-container">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
              endIcon={<ExpandMoreIcon />}
            >
              {mostrarDetalles ? 'Ocultar Detalles' : 'Ver Detalles'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Imprimir Resultados
            </Button>
          </Box>

          <Collapse in={mostrarDetalles}>
            <Box className="detalles-section">
              <Typography variant="h6">
                Detalles de la Evaluación
              </Typography>
              <Grid container spacing={2}>
                {evaluacion.respuestas.map((resp, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" className="respuesta-card">
                      <Typography variant="subtitle1">
                        Pregunta {resp.pregunta_id}
                      </Typography>
                      <Typography>
                        Respuesta: {resp.respuesta}
                      </Typography>
                      <Typography>
                        Puntaje: {resp.puntaje}
                      </Typography>
                      {resp.contextos && resp.contextos.length > 0 && (
                        <Box className="contextos-container">
                          <Typography variant="subtitle2">
                            Contextos:
                          </Typography>
                          <Box className="chips-container">
                            {resp.contextos.map((contexto, idx) => (
                              <Chip
                                key={idx}
                                label={contexto}
                                size="small"
                                className="contexto-chip"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </Paper>
      </Container>
    </div>
  );
};

export default Resultado;