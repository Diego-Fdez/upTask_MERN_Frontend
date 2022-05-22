import FormularioColaborador from "../components/FormularioColaborador";
import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";
import Alerta from "../components/Alerta";

const NuevoColaborador = () => {

  const {obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta} = useProyectos();
  const params = useParams();
  
  //effect que obtiene el proyecto
  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  //revisa que exista el proyecto
  if(!proyecto?._id) return <Alerta alerta={alerta} />;

  return (
    <>
      <h1 className='font-black text-4xl text-sky-600'>Añadir Colaborador(a) al Proyecto: {proyecto.nombre}</h1>
      <div className="mt-10 flex justify-center md:2/3">
        <FormularioColaborador />
      </div>
      {cargando ? <Spinner /> : colaborador?._id && (
        <div className="flex justify-center mt-10">
          <div className="bg-white py-10 px-5 md:w-2/3 w-full rounded-lg">
            <h2 className="text-center text-gray-700  mb-10 text-2xl font-bold">Resultado:</h2>
            <div className="flex justify-center flex-col md:flex-row gap-3 items-center">
              <div>
              <p><span className="text-gray-600 font-bold">Nombre:</span> {colaborador.nombre}</p>
              <p>{colaborador.email}</p>
              </div>
              <motion.input 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                value="Agregar al Proyecto"
                type="submit" 
                className="ml-3 cursor-pointer bg-transparent py-3 px-1 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700"
                onClick={() => agregarColaborador({
                  email: colaborador.email
                })}
                />
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default NuevoColaborador;