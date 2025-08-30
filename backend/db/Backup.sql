-- psql -U postgres -d votoec -f backend/db/Backup.sql


--    ENTIDAD ROLES
INSERT INTO roles (nombre) VALUES
  ('Administrador'),
  ('Cliente');


  --  ENTIDAD USUARIO 
INSERT INTO usuarios (email, nombre, apellido, cedula, telefono, contrasena, rol_id) VALUES
  ('admin@universidad.edu', 'Admin', 'Principal', '0101010101', '0999999999', '$2b$10$bqMHB.m8XuxAIPcyZ2dyfeRSB1r4r3xkf8oFTEHEuu7fZSmPQfkFG', 1), --admin123
  ('cliente@universidad.edu', 'Carlos', 'Estudiante', '0202020202', '0988888888', 'cliente123', 2),
  ('invitado@universidad.edu', 'Iván', 'Invitado', '0303030303', '0977777777', 'invitado123', 3);


 