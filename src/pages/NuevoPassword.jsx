import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";
import { toast } from "react-toastify";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const NuevoPassword = () => {

  const [password, setPassword] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [passwordModificado, setPasswordModificado] = useState(false);

  //leemos los parametros que vienen del servidor
  const params = useParams();
  //extraemos el token
  const { token } = params;

  useEffect(() => {
    //comprueba que el token sea correcto y válido
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/forgetpwd/${token}`);
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        });
      }
    };
    comprobarToken();
  }, []);

  //función del submit del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    if(password.length < 6) {
      setAlerta({
        msg: 'La contraseña es muy corta, mínimo 8 caracteres',
        error: true
      });
      return
    }
    setAlerta({});
    //si paso la validación guardamos la nueva contraseña en la BD
    try {
      const url = `/usuarios/forgetpwd/${token}`;
      const { data } = await clienteAxios.post(url, { password });
      toast.success(data.msg);
      setPasswordModificado(true);
      setPassword('');
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">
        Restablece Tu Acceso y No Pierdas Acceso a Tus <span className="text-slate-500">Proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}
      {/* Si el token es válido, mostramos el formulario */}
      { tokenValido && (
        <form 
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10"
      >
        <div className="my-5">
          <label 
            htmlFor="password" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Nueva Contraseña:
          </label>
          <input
            type="password" 
            name="password" 
            id="password" 
            placeholder="Escribe tu nueva contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <motion.input 
          variants={variants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          value="Guardar Contraseña"
          type="submit" 
          className="mb-5bg-transparent w-full py-3 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700"
        />
      </form>
      )}
      {/* si la cuenta esta confirmada */}
      {passwordModificado && (
          <Link 
          className="block text-center my-5 text-slate-400 uppercase text-sm"
          to="/"
        >
          Inicia Sesión
      </Link>
        )}
    </>
  )
};

export default NuevoPassword;