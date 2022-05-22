import useProyectos from "../hooks/useProyectos";
import useAdmin from "../context/useAdmin";

const Colaborador = ({colaborador}) => {

  const {handleModalEliminarColaborador} = useProyectos();

  const {nombre, email} = colaborador;

  const admin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div>
        <p>{nombre}</p>
        <p className="text-sm text-gray-700">{email}</p>
      </div>
      {admin && (
      <button
          className='mt-3 text-gray-500 hover:text-sky-600 uppercase flex items-center font-bold text-xs'
          type='button'
          onClick={() => handleModalEliminarColaborador(colaborador)}
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
  )
};

export default Colaborador;