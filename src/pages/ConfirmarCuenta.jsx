import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import { toast } from "react-toastify";

const ConfirmarCuenta = () => {
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  //leemos el id que viene en la URL
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios(url);
        toast.success(data.msg);
        setCuentaConfirmada(true);
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    };
    confirmarCuenta();
  }, []);

  return (
    <>
      <h1 className='text-sky-600 font-black text-3xl'>
        Confirma Tu Cuenta y Comienza a Crear Tus{" "}
        <span className='text-slate-500'>Proyectos</span>
      </h1>
      <div className='mt-20 md:mt-5 shadow-lgpx-5 py-10 rounded-xl bg-white'>
        {/* si la cuenta esta confirmada */}
        {cuentaConfirmada && (
          <Link
            className='block text-center my-5 text-slate-400 uppercase text-sm'
            to='/'
          >
            Inicia Sesión
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmarCuenta;
