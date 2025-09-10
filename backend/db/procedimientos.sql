-- =============================================
-- Procedimientos Almacenados - Sistema Caryan
-- Base de datos: caryan

-- =============================================
--                  LOGIN
-- =============================================
CREATE OR REPLACE FUNCTION login_usuario(_email TEXT)
RETURNS TABLE(
  id INTEGER,
  email TEXT,
  contrasena TEXT,
  nombre TEXT,
  rol_id INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id, 
    u.email::TEXT, 
    u.contrasena::TEXT,
    u.nombre::TEXT,
    u.rol_id
  FROM usuarios u
  WHERE u.email = _email;  -- quitamos "AND u.activo = TRUE"
END;
$$ LANGUAGE plpgsql;

-- =============================================
--                 ENTIDAD ROLES
-- =============================================
--    Crear nuevo rol
CREATE OR REPLACE FUNCTION nuevo_rol(_nombre TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO roles (nombre) VALUES (_nombre);
END;
$$ LANGUAGE plpgsql;
-- =============================================
---   Listar roles
CREATE OR REPLACE FUNCTION listar_roles()
RETURNS TABLE(
  id INT,
  nombre VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.nombre
  FROM roles r;
END;
$$ LANGUAGE plpgsql;
-- =============================================
---   Actualizar un rol 
CREATE OR REPLACE FUNCTION actualizar_rol(_id INT, _nombre TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE roles SET nombre = _nombre WHERE id = _id;
END;
$$ LANGUAGE plpgsql;
-- =============================================
---   Eliminar un rol
CREATE OR REPLACE FUNCTION eliminar_rol(_id INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM roles WHERE id = _id;
END;
$$ LANGUAGE plpgsql;
-- =============================================
--                ENTIDAD USUARIO
-- =============================================
-- Insertar nuevo usuario
CREATE OR REPLACE FUNCTION nuevo_usuario(
  _nombre VARCHAR(100),
  _apellido VARCHAR(100),
  _cedula VARCHAR(20),
  _telefono VARCHAR(20),
  _email VARCHAR(255),
  _contrasena VARCHAR(255),
  _rol_id INT DEFAULT 2 -- 1=admin, 2=cliente
)
RETURNS INTEGER AS $$
DECLARE
  nuevo_id INTEGER;
BEGIN
  -- Validar existencia previa
  IF EXISTS (SELECT 1 FROM usuarios WHERE email = _email) THEN
    RAISE EXCEPTION 'El email % ya está registrado', _email;
  END IF;

  INSERT INTO usuarios (nombre, apellido, cedula, telefono, email, contrasena, rol_id)
  VALUES (_nombre, _apellido, _cedula, _telefono, _email, _contrasena, _rol_id)
  RETURNING id INTO nuevo_id;

  RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Obtener lista de usuarios por rol (ejemplo: rol 3 = personal médico)
-- Solución: referencia explícita con usuarios.id
CREATE OR REPLACE FUNCTION obtener_personal_medico()
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR,
  apellido VARCHAR,
  cedula VARCHAR,
  telefono VARCHAR,
  email VARCHAR,
  fecha_registro TIMESTAMP,
  rol VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.nombre, u.apellido, u.cedula, u.telefono, u.email, u.fecha_registro, r.nombre AS rol
  FROM usuarios u
  JOIN roles r ON u.rol_id = r.id
  WHERE u.rol_id = 3;
END;
$$ LANGUAGE plpgsql;

-- Obtener clientes
CREATE OR REPLACE FUNCTION obtener_clientes()
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR,
  apellido VARCHAR,
  cedula VARCHAR,
  telefono VARCHAR,
  email VARCHAR,
  fecha_registro TIMESTAMP,
  rol VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.nombre, u.apellido, u.cedula, u.telefono, u.email, u.fecha_registro, r.nombre AS rol
  FROM usuarios u
  JOIN roles r ON u.rol_id = r.id
  WHERE u.rol_id = 2;
END;
$$ LANGUAGE plpgsql;



-- Eliminar usuario por email
CREATE OR REPLACE FUNCTION eliminar_usuario(
  _email VARCHAR(255)
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM usuarios WHERE email = _email;
END;
$$ LANGUAGE plpgsql;

-- Actualizar datos de usuario

CREATE OR REPLACE FUNCTION actualizar_usuario(
    p_email TEXT,
    p_nombre TEXT DEFAULT NULL,
    p_apellido TEXT DEFAULT NULL,
    p_cedula TEXT DEFAULT NULL,
    p_telefono TEXT DEFAULT NULL,
    p_contrasena TEXT DEFAULT NULL,
    p_rol_id INT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE usuarios
    SET
        nombre      = COALESCE(NULLIF(p_nombre, ''), nombre),
        apellido    = COALESCE(NULLIF(p_apellido, ''), apellido),
        cedula      = COALESCE(NULLIF(p_cedula, ''), cedula),
        telefono    = COALESCE(NULLIF(p_telefono, ''), telefono),
        contrasena  = COALESCE(NULLIF(p_contrasena, ''), contrasena),
        rol_id      = COALESCE(p_rol_id, rol_id)
    WHERE email = p_email;
END;
$$ LANGUAGE plpgsql;

-- =============================================
--                ENTIDAD FORMULARIO
-- =============================================

-- Insertar formularios
CREATE OR REPLACE FUNCTION insertar_formulario(p_formulario JSONB, p_user_id INT)
RETURNS INT AS $$
DECLARE
    nuevo_id INT;
BEGIN
    INSERT INTO formularios(
        user_id, nombre_nino, edad, fecha_nacimiento, sexo,
        cuidador_principal, parentesco, nacionalidad, contacto,
        convivencia, hermanos, dificultades_hermanos, cuidador_dia, cuidador_dia_otro,
        embarazo_controlado, complicaciones, complicaciones_otro,
        embarazo_planeado, tipo_parto, prematuro, hospitalizacion, tiempo_hospitalizacion,
        dificultad_nacimiento, dificultad_nacimiento_detalle,
        lactancia, dificultades_alimentacion, dificultades_alimentacion_desc,
        temperamento, estimulacion, hitos
    )
    VALUES (
        p_user_id,
        p_formulario->>'nombreNino',
        (p_formulario->>'edad')::INT,
        (p_formulario->>'fechaNacimiento')::DATE,
        p_formulario->>'sexo',
        p_formulario->>'cuidadorPrincipal',
        p_formulario->>'parentesco',
        p_formulario->>'nacionalidad',
        p_formulario->>'contacto',
        p_formulario->>'convivencia',
        p_formulario->>'hermanos',
        p_formulario->>'dificultadesHermanos',
        p_formulario->>'cuidadorDia',
        p_formulario->>'cuidadorDiaOtro',
        p_formulario->>'embarazoControlado',
        ARRAY(SELECT jsonb_array_elements_text(p_formulario->'complicaciones')), -- conversión a text[]
        p_formulario->>'complicacionesOtro',
        p_formulario->>'embarazoPlaneado',
        p_formulario->>'tipoParto',
        p_formulario->>'prematuro',
        p_formulario->>'hospitalizacion',
        p_formulario->>'tiempoHospitalizacion',
        p_formulario->>'dificultadNacimiento',
        p_formulario->>'dificultadNacimientoDetalle',
        p_formulario->>'lactancia',
        p_formulario->>'dificultadesAlimentacion',
        p_formulario->>'dificultadesAlimentacionDesc',
        p_formulario->>'temperamento',
        p_formulario->>'estimulacion',
        p_formulario->'hitos'
    )
    RETURNING id INTO nuevo_id;

    RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Listar formularios 
CREATE OR REPLACE VIEW vista_formularios AS
SELECT 
    f.id,
    f.user_id,
    u.email AS usuario,
    f.nombre_nino,
    f.edad,
    f.fecha_nacimiento,
    f.sexo,
    f.cuidador_principal,
    f.parentesco,
    f.nacionalidad,
    f.contacto,
    f.convivencia,
    f.hermanos,
    f.dificultades_hermanos,
    f.cuidador_dia,
    f.cuidador_dia_otro,
    f.embarazo_controlado,
    f.complicaciones,
    f.complicaciones_otro,
    f.embarazo_planeado,
    f.tipo_parto,
    f.prematuro,
    f.hospitalizacion,
    f.tiempo_hospitalizacion,
    f.dificultad_nacimiento,
    f.dificultad_nacimiento_detalle,
    f.lactancia,
    f.dificultades_alimentacion,
    f.dificultades_alimentacion_desc,
    f.temperamento,
    f.estimulacion,
    f.hitos,
    f.created_at
FROM formularios f
JOIN usuarios u ON u.id = f.user_id;


-- =============================================
--                ENTIDAD EVALUACION
-- =============================================

-- Guardar evaluación
CREATE OR REPLACE FUNCTION fn_guardar_evaluacion(
    p_formulario_id INT,
    p_user_id INT,
    p_respuestas JSONB
) RETURNS INT AS $$
DECLARE
    v_evaluacion_id INT;
    v_puntaje_total INT;
    v_recomendacion TEXT;
BEGIN
    -- Calcular el puntaje total sumando los puntajes de las respuestas
    SELECT COALESCE(SUM((r->>'puntaje')::INT), 0) INTO v_puntaje_total
    FROM jsonb_array_elements(p_respuestas) AS r;

    -- Calcular la recomendación según el puntaje total
    IF v_puntaje_total < 10 THEN
        v_recomendacion := 'No se recomienda atención';
    ELSIF v_puntaje_total < 20 THEN
        v_recomendacion := 'Se recomienda atención';
    ELSE
        v_recomendacion := 'Atención urgente';
    END IF;

    -- Insertar evaluación con puntaje y recomendación
    INSERT INTO evaluaciones (
        formulario_id,
        user_id, 
        respuestas, 
        fecha,
        puntaje_total,
        recomendacion
    )
    VALUES (
        p_formulario_id,
        p_user_id, 
        p_respuestas, 
        CURRENT_TIMESTAMP,
        v_puntaje_total,
        v_recomendacion
    )
    RETURNING id INTO v_evaluacion_id;
    
    RETURN v_evaluacion_id;
END;
$$ LANGUAGE plpgsql;

-- Obtener evaluación por formulario_id (la más reciente)
CREATE OR REPLACE FUNCTION fn_obtener_evaluacion_por_formulario(p_formulario_id integer)
RETURNS TABLE (
  id integer,
  formulario_id integer,
  user_id integer,
  fecha timestamp,
  respuestas jsonb,
  puntaje_total integer,
  recomendacion text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    evaluaciones.id,
    evaluaciones.formulario_id,
    evaluaciones.user_id,
    evaluaciones.fecha,
    evaluaciones.respuestas,
    evaluaciones.puntaje_total,
    evaluaciones.recomendacion
  FROM evaluaciones
  WHERE evaluaciones.formulario_id = p_formulario_id
  ORDER BY evaluaciones.fecha DESC;
END;
$$ LANGUAGE plpgsql;

-- Obtener TODAS las evaluaciones de un usuario (historial)
CREATE OR REPLACE FUNCTION fn_mis_evaluaciones(
    p_user_id INT
) RETURNS TABLE (
    id INT,
    formulario_id INT,
    fecha TIMESTAMP,
    puntaje_total INT,
    recomendacion TEXT
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            evaluaciones.id,
            evaluaciones.formulario_id,
            evaluaciones.fecha,
            evaluaciones.puntaje_total AS puntaje_total,
            evaluaciones.recomendacion
        FROM evaluaciones
        WHERE evaluaciones.user_id = p_user_id
        ORDER BY evaluaciones.fecha DESC;
END;
$$ LANGUAGE plpgsql;