-- psql -U postgres -d votoec -f backend/db/Backup.sql


--    ENTIDAD ROLES

INSERT INTO roles (id, nombre) VALUES
  (1, 'ADMINISTRADOR'),
  (2, 'CLIENTE'),
  (3, 'ENCARGADO')
ON CONFLICT (id) DO NOTHING;


  --  ENTIDAD USUARIO 
INSERT INTO usuarios (id, nombre, apellido, cedula, telefono, email, contrasena, rol_id)
VALUES
  (1, 'Admin', 'Principal', '100000001', '0991111111', 'admin@sistema.com', 'admin123', 1),
  (2, 'Cliente', 'Ejemplo', '100000002', '0992222222', 'cliente@sistema.com', 'cliente123', 2),
  (3, 'Encargado', 'Asistente', '100000003', '0993333333', 'encargado@sistema.com', 'encargado123', 3)
ON CONFLICT (id) DO NOTHING;


 