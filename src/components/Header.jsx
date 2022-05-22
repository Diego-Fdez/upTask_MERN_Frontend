import { Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import Busqueda from "./Busqueda";
import useAuth from "../hooks/useAuth";

const Header = () => {

  const {handleBuscador, cerrarSesionProyectos} = useProyectos();
  const {cerrarSesionAuth} = useAuth();

  //handle de cerrar sesión
  const handleCerrarSesion = () => {
    cerrarSesionAuth();
    cerrarSesionProyectos();
    localStorage.removeItem('token');
  };

  return (
    <header className="px-4 py-5 bg-transparent ">
      <div className="md:flex md:justify-between">
        <h2 className="text-4xl text text-sky-600 font-black text-center mb-5 md:mb-0">
          Uptask
        </h2>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={handleBuscador}
            className="font-bold flex items-center gap-1 text-xs uppercase bg-transparent border-2 border-sky-600 rounded-md px-1 text-sky-600 transition-colors hover:bg-sky-600 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar Proyecto
          </button>
          <Link 
            to="/proyectos"
            className="font-bold uppercase text-slate-400 hover:text-sky-600"
          >
            Proyectos 
          </Link>
          <button 
            type="button"
            title="Cerrar Sesión"
            className="text-sky-600 hover:text-slate-400"
            onClick={handleCerrarSesion}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          <Busqueda />
        </div>
      </div>
    </header>
  )
};

export default Header;