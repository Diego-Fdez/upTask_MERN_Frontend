import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SideBar = () => {

  const { auth } = useAuth();

  return (
    <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10">
      <p className=" text-white text-xl font-bold">
        Hola: {auth.nombre}
      </p>
      <Link 
        to="crear-proyectos" 
        className="flex items-center flex-row md:text-xs text-white bg-sky-600 p-3 w-full uppercase font-bold mt-5 justify-center rounded-lg cursor-pointer hover:bg-transparent hover:border-2 hover:border-sky-600 transition-colors hover:text-sky-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="md:h-3 md:w-3 h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Nuevo Proyecto
      </Link>
    </aside>
  )
};

export default SideBar;