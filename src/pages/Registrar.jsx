import {Link} from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/Alerta";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import clienteAxios from "../config/clienteAxios";

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

const Registrar = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  //submit del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    //validamos que todos los campos estén llenos
    if([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: "Todos los campos son obligatorios", 
        error: true
      });
      return
    };

    //validamos que el password = repetirPassword
    if (password !== repetirPassword) {
      setAlerta({
        msg: "Las contraseñas no coinciden", 
        error: true
      });
      return
    };

    //validamos que el password tenga el largo adecuado
    if (password.length < 8) {
      setAlerta({
        msg: "La contraseña es muy corta, mínimo 8 caracteres", 
        error: true
      });
      return
    }
    setAlerta({});

    //Crear el usuario en la API
    try {
      const { data } = await clienteAxios.post(`usuarios`, {nombre, email, password});
      toast.success(data.msg);
      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
    } catch (error) {
      toast.error(error.response.data.msg);
    }
    
  };

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">
        Crea Tu Cuenta y Administra Tus <span className="text-slate-500">Proyectos</span>
      </h1>
      <form 
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label 
            htmlFor="nombre" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Nombre:
          </label>
          <input 
            type="text" 
            name="nombre" 
            id="nombre" 
            placeholder="Tu Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre} 
            onChange={e => setNombre(e.target.value)}
          />
        </div>
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
        <div className="my-5">
          <label 
            htmlFor="password2" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Repetir Contraseña:
          </label>
          <input 
            type="password" 
            name="password2" 
            id="password2" 
            placeholder="Repite tu contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword} 
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>
        { msg && <Alerta alerta={alerta} /> }
        <motion.input 
          variants={variants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          value="Crear Cuenta"
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
          to="/forgetpwd"
        >
          Olvide Contraseña
        </Link>
      </nav>
    </>
  )
};

export default Registrar;