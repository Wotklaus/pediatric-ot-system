require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Conexión a PostgreSQL
const pool = require("./config/postgres"); // asegúrate de que esté configurado correctamente

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",  // 👈 cambia por el dominio real en producción
  credentials: true
}));
app.use(express.json());

// Rutas PostgreSQL
const registerRoute = require("./routes/register.routes"); 
const usuarioRoutes = require("./routes/postgres/usuario.routes"); 
const rolRoutes = require("./routes/postgres/rol.routes"); 
const loginRoutes = require("./routes/login.routes");
const formularioRoutes = require("./routes/postgres/formulario.routes");
const evaluacionRoutes = require("./routes/postgres/evaluacion.routes");
const estadisticasRoutes = require("./routes/estadisticas.routes");


// Endpoints
app.use("/api/registro", registerRoute);
app.use("/api/pg/usuarios", usuarioRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/formularios", formularioRoutes);
app.use("/api/postgres/evaluaciones" , evaluacionRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://0.0.0.0:${PORT}`);
});
