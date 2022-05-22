import {Link} from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import { motion } from "framer-motion";
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

const OlvidePassword = () => {

  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  //submit del formulario para enviar petición de restablecer contraseña
  const handleSubmit = async e => {
    e.preventDefault();

    //verificamos que no hayan campos vacíos
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if(email === '') {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return
    }
    if(emailRegex.test(email)===false) {
      setAlerta({
        msg: 'No es tipo de correo válido',
        error: true
      });
      return
    }
    setAlerta({});
    //si pasa las validaciones, enviamos el correo
    try {
      const {data} = await clienteAxios.post(`/usuarios/forgetpwd`, {email});
      toast.success(data.msg);
      setEmail('');
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const {msg} = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">
        Recupera Tu Acceso y No Pierdas Tus <span className="text-slate-500">Proyectos</span>
      </h1>
      <form 
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label 
            htmlFor="email" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Correo:
          </label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Correo de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        {msg && <Alerta alerta={alerta} />}
        <motion.input 
          variants={variants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          value="Enviar Instrucciones"
          type="submit" 
          className="mb-5bg-transparent w-full py-3 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700"
        />
      </form>
      <nav 
        className="lg:flex lg:justify-between"
      >
        <Link 
          className="block text-center my-5 text-slate-400 uppercase text-sm"
          to="/"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
        <Link 
          className="block text-center my-5 text-slate-400 uppercase text-sm"
          to="/registrar"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
      </nav>
    </>
  )
};

export default OlvidePassword;