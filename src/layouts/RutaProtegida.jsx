import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Spinner from "../components/Spinner";

const RutaProtegida = () => {

  const { auth, cargando } = useAuth();

  //validamos que este cargando el perfil del usuario
  if(cargando) return <Spinner />;

  return (
    <>
      {auth._id ? (
        <div className="bg-gradient-to-b from-black to-gray-700 bg-opacity-60">
          <Header />
          <div className="md:flex md:min-h-screen">
            <SideBar />
            <main className="p-10 flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      ) : <Navigate to="/" />}
    </>
  )
};

export default RutaProtegida;