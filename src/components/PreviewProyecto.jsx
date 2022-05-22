import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useProyecto from "../hooks/useProyectos";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";

const PreviewProyecto = ({proyecto}) => {

  const {auth} = useAuth();

  const { cargando } = useProyecto();

  const { nombre, _id, cliente, creador } = proyecto;

  return cargando ? (
    <Spinner />
  ) : (
    <div className="border-b p-5 flex flex-col md:flex-row justify-between">
      <div className="flex items-center gap-2">
      <p className="flex-1">
        {nombre}
        <span className="text-sm text-gray-500 uppercase">
          {' '}{cliente}
        </span>
      </p>
      {auth._id !== creador && (
        <p className="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">Colaborador</p>
      )}
      </div>
      <Link 
        to={`${_id}`} 
        className="text-gray-600 hover:text-sky-600 uppercase text-sm text-bold"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >Ver Proyecto</motion.button>
      </Link>
    </div>
  )
};

export default PreviewProyecto;