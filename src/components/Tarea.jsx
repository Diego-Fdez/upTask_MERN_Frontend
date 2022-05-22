import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../context/useAdmin";

const Tarea = ({ tarea }) => {

  const admin = useAdmin();

  const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea} = useProyectos();

  const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea;

  return (
    <>
      <div className='flex gap-2 justify-end mr-4'>
        {admin && (
        <button
          className='mt-3 text-gray-500 hover:text-sky-600 uppercase flex items-center font-bold text-xs'
          type='button'
          onClick={() => handleModalEditarTarea(tarea)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3 w-3'
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
        </button>
        )}
          <button
          className='mt-3 text-gray-500 hover:text-sky-600 uppercase flex items-center font-bold text-xs'
          type='button'
          onClick={() => completarTarea(_id)}
        >
          {estado ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3 w-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
            />
          </svg> ) :
          (<svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3 w-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg> )}
          {estado ? "Completa" : "Incompleta"}
        </button>
        {admin && (
        <button
          className='mt-3 text-gray-500 hover:text-sky-600 uppercase flex items-center font-bold text-xs'
          type='button'
          onClick={() => handleModalEliminarTarea(tarea)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3 w-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
          Eliminar
        </button>
        )}
      </div>
      <div className='border-b p-5 flex'>
        <div className="flex flex-col items-start">
          <p className='mb-1 text-xl uppercase'>
            <span className='font-bold'>Nombre:</span> {nombre}
          </p>
          <p className='mb-1 text-sm text-gray-500 uppercase'>
            <span className='font-bold text-black'>Descripción:</span> {descripcion}
          </p>
          <p className='mb-1 text-sm uppercase'>
            <span className='font-bold'>Fecha de Entrega: </span>
            {formatearFecha(fechaEntrega)}
          </p>
          <p className={`${ (prioridad === "Alta")  ? "text-red-400" : (prioridad === "Media") ? "text-yellow-300" : "text-gray-500" } uppercase mb-1`}>
            <span className='font-bold text-black'>Prioridad: </span>
            {prioridad}
          </p>
          {estado && <p className="text-xs bg-green-600 uppercase rounded-lg p-1 text-white">Completada por: {tarea.completado.nombre}</p>}
        </div>
      </div>
    </>
  );
};

export default Tarea;
