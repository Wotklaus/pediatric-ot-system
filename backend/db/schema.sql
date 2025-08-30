-- ============================================
--          CREACIÓN BASE DE DATOS
-- ============================================
 CREATE DATABASE caryan;




-- ============================================
--                  ENTIDADES
-- ============================================

--    ENTIDAD ROLES
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

--    ENTIDAD USUARIO
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cedula VARCHAR(20),
  telefono VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rol_id INTEGER NOT NULL REFERENCES roles(id)
);

--    ENTIDAD FORMULARIO
CREATE TABLE IF NOT EXISTS formularios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id),  -- cuidador que registra al niño
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- SECCIÓN 1: Información general del niño
    nombre_nino VARCHAR(100),
    edad VARCHAR(10),
    fecha_nacimiento DATE,
    sexo VARCHAR(10),
    cuidador_principal VARCHAR(100),
    parentesco VARCHAR(50),
    nacionalidad VARCHAR(50),
    contacto VARCHAR(20),
    convivencia VARCHAR(100),
    hermanos VARCHAR(5),
    dificultades_hermanos VARCHAR(5) NULL, -- solo si hermanos='sí'
    cuidador_dia VARCHAR(50),
    cuidador_dia_otro VARCHAR(50) NULL,   -- solo si cuidador_dia='otro'

    -- SECCIÓN 2: Embarazo y nacimiento
    embarazo_controlado VARCHAR(20),
    complicaciones TEXT[],   -- array de complicaciones
    complicaciones_otro VARCHAR(100) NULL,
    embarazo_planeado VARCHAR(5),
    tipo_parto VARCHAR(20),
    prematuro VARCHAR(5),
    hospitalizacion VARCHAR(5),
    tiempo_hospitalizacion VARCHAR(50) NULL,
    dificultad_nacimiento VARCHAR(5),
    dificultad_nacimiento_detalle TEXT NULL,

    -- SECCIÓN 3: Alimentación y cuidados tempranos
    lactancia VARCHAR(20),
    dificultades_alimentacion VARCHAR(5),
    dificultades_alimentacion_desc TEXT NULL,
    temperamento VARCHAR(50),
    estimulacion VARCHAR(50),

    -- SECCIÓN 4: Hitos del desarrollo
    hitos JSONB   -- edad, esperado y razones si responde "No"
);


--    ENTIDAD EVALUACIONES
CREATE TABLE IF NOT EXISTS evaluaciones (
    id SERIAL PRIMARY KEY,
    formulario_id INTEGER NOT NULL REFERENCES formularios(id),
    user_id INTEGER NOT NULL REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respuestas JSONB NOT NULL DEFAULT '[]'
    -- Las respuestas serán así:
    -- [
    --     {
    --         "pregunta_id": 1,
    --         "respuesta": "2",
    --         "puntaje": 2,
    --         "contextos": ["No ha tenido tiempo", "Tiene miedo"]
    --     }
    -- ]
);



