import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";

// Importa todos los componentes/páginas que existen en src/pages
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";
import Perfil from "./pages/Perfil";
import MisFormularios from "./pages/MisFormularios";
import Disclaimer from "./pages/Disclaimer";
import Evaluacion from "./pages/Evaluacion";
import MisResultados from "./pages/MisResultados";
import Admin from "./pages/Admin";
import PerfilPaciente from "./pages/PerfilPaciente";
import Clientes from "./pages/Clientes";
import Encargado from "./pages/Encargado";
import Estadisticas from "./pages/Estadisticas";
import HistoriasClinicas from "./pages/HistoriasClinicas";
import Pacientes from "./pages/Pacientes";
import PersonalMedico from "./pages/PersonalMedico";
import RegistroRepresentante from "./pages/RegistroRepresentante";
import ResultadosEvaluacion from "./pages/ResultadosEvaluacion";
import Roles from "./pages/Roles";

// Componente para proteger rutas
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/home" element={<Home />} />

          {/* Rutas protegidas */}
          <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
          <Route path="/formulario" element={<ProtectedRoute><Formulario /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/misformularios" element={<ProtectedRoute><MisFormularios /></ProtectedRoute>} />
          <Route path="/evaluacion" element={<ProtectedRoute><Evaluacion /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/misresultados" element={<ProtectedRoute><MisResultados /></ProtectedRoute>} />
          <Route path="/perfilpaciente" element={<ProtectedRoute><PerfilPaciente /></ProtectedRoute>} />
          {/* NUEVAS VISTAS PROTEGIDAS */}
          <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
          <Route path="/encargado" element={<ProtectedRoute><Encargado /></ProtectedRoute>} />
          <Route path="/estadisticas" element={<ProtectedRoute><Estadisticas /></ProtectedRoute>} />
          <Route path="/historiasclinicas" element={<ProtectedRoute><HistoriasClinicas /></ProtectedRoute>} />
          <Route path="/pacientes" element={<ProtectedRoute><Pacientes /></ProtectedRoute>} />
          <Route path="/personalmedico" element={<ProtectedRoute><PersonalMedico /></ProtectedRoute>} />
          <Route path="/registrorepresentante" element={<ProtectedRoute><RegistroRepresentante /></ProtectedRoute>} />
          <Route path="/resultadosevaluacion" element={<ProtectedRoute><ResultadosEvaluacion /></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;