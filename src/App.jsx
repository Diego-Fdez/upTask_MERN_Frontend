import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import OlvidePassword from "./pages/OlvidePassword";
import NuevoPassword from "./pages/NuevoPassword";
import ConfirmarCuenta from "./pages/ConfirmarCuenta";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import { ProyectosProvider } from "./context/ProyectosProvider";
import Proyectos from "./pages/Proyectos";
import RutaProtegida from "./layouts/RutaProtegida";
import NuevoProyecto from "./pages/NuevoProyecto";
import Proyecto from "./pages/Proyecto";
import EditarProyecto from "./pages/EditarProyecto";
import NuevoColaborador from "./pages/NuevoColaborador";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='registrar' element={<Registrar />} />
              <Route path='forgetpwd' element={<OlvidePassword />} />
              <Route path='forgetpwd/:token' element={<NuevoPassword />} />
              <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
            </Route>
            <Route path='/proyectos' element={<RutaProtegida />}>
              <Route index element={<Proyectos />} />
              <Route path='crear-proyectos' element={<NuevoProyecto />} />
              <Route path='nuevo-colaborador/:id' element={<NuevoColaborador />} />
              <Route path=':id' element={<Proyecto />} />
              <Route path='editar/:id' element={<EditarProyecto />} />
            </Route>
          </Routes>
          <ToastContainer />
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
