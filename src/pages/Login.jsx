import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

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

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  //submit del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    //comprobamos que no hayan espacios vacíos
    if([email, password].includes('')) {
      setAlerta({
        msg: 'Todos los campos son requeridos',
        error: true
      })
      return
    }

    //si paso las validaciones, logueamos al usuario
    try {
      const {data} = await clienteAxios.post('/usuarios/login', {email, password});
      setAlerta({});
      //guardamos el token en localStorage
      localStorage.setItem('token', data.token);
      //pasamos los datos al provider
      setAuth(data);
      navigate('/proyectos');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const {msg} = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">
        Inicia Sesión y Administra Tus <span className="text-slate-500">Proyectos</span>
      </h1>
      <form 
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10"
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

        <div className="my-5">
          <label 
            htmlFor="password" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Contraseña:
          </label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Escribe tu contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password} 
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {msg && <Alerta alerta={alerta} />}
        <motion.input 
          variants={variants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          value="Iniciar Sesión"
          type="submit" 
          className="mb-5 bg-transparent cursor-pointer w-full py-3 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700"
        />
      </form>
      <nav 
        className="lg:flex lg:justify-between"
      >
        <Link 
          className="block text-center my-5 text-slate-400 uppercase text-sm"
          to="registrar"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
        <Link 
          className="block text-center my-5 text-slate-400 uppercase text-sm"
          to="/forgetpwd"
        >
          Olvide Contraseña
        </Link>
      </nav>
    </>
  )
};

export default Login;