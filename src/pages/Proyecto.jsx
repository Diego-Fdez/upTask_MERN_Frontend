import { useParams, Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import Tarea from "../components/Tarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Spinner from "../components/Spinner";
import useAdmin from "../context/useAdmin";
import io from "socket.io-client";
import { formatearFecha } from "../helpers/formatearFecha";

let socket;

const Proyecto = () => {
  const params = useParams();

  const { obtenerProyecto, proyecto, cargando, handleModalTarea, submitTareasProyecto, eliminarTareaProyecto, editarTareaProyecto, completaTarea } =
    useProyectos();

  const admin = useAdmin();

  //obtenemos el proyecto
  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  //effect para conectarse a socket.io
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('abrir proyecto', params.id);
  }, []);

  //effect de socket que escucha las tareas nuevas
  useEffect(() => {
    //socket que lee las tareas
    socket.on("tarea agregada", tareaNueva => {
      if(tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva);
      }
    });

    //socket de tareas eliminadas
    socket.on('tarea eliminada', tareaEliminada => {
      if(tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada)
      }
    });

    //socket de tareas actualizadas
    socket.on('tarea editada', tareaEditada => {
      if(tareaEditada.proyecto._id === proyecto._id) {
        editarTareaProyecto(tareaEditada);
      }
    });

    //socket que completa tareas
    socket.on('tarea completada', tareaCompletada => {
      if(tareaCompletada.proyecto._id === proyecto._id) {
        completaTarea(tareaCompletada);
      }
    })
  });

  const { nombre, fechaEntrega } = proyecto;

  if (cargando) return <Spinner />;

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='font-black text-4xl text-sky-600'>{nombre}</h1>
        {admin && (
        <div className='flex items-center gap-2 text-gray-500 hover:text-sky-600'>
          <Link
            to={`/proyectos/editar/${params.id}`}
            className='flex uppercase font-bold'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
            Editar
          </Link>
        </div>
        )}
      </div>
      <div className="mt-3">
      <p className="text-gray-700 font-bold text-sm">Fecha de Entrega: <span className="text-xs">{fechaEntrega.split('T')[0]}</span></p>
      </div>
      {admin && (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className='flex mt-5 justify-center items-center bg-transparent gap-2 w-full text-sm px-5 py-3 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700 md:w-auto'
        type='button'
        onClick={handleModalTarea}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        Nueva Tarea
      </motion.button>
      )}
      <p className='font-bold text-white text-xl mt-10'>Tareas del Proyecto</p>
      <div className='bg-white mt-10 rounded-lg'>
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <p className='text-center my-5 p-10'>
            No hay tareas en este proyecto
          </p>
        )}
      </div>
      <div className='flex items-center justify-between mt-10'>
        <p className='font-bold text-white text-xl'>Colaboradores</p>
        {admin && (
        <Link
          to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
          className='flex uppercase items-center font-bold text-gray-500 hover:text-sky-600'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
            />
          </svg>
          Añadir
        </Link>
        )}
      </div>
      <div className='bg-white mt-10 rounded-lg'>
        {proyecto.colaboradores?.length ? (
          proyecto.colaboradores?.map((colaborador) => (
            <Colaborador key={colaborador._id} colaborador={colaborador} />
          ))
        ) : (
          <p className='text-center my-5 p-10'>
            No hay colaboradores en este proyecto.
          </p>
        )}
      </div>
      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
};

export default Proyecto;
