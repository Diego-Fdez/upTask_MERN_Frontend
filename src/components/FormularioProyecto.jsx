import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";
import { useParams } from "react-router-dom";

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

const FormularioProyecto = () => {

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [cliente, setCliente] = useState('');

  const params = useParams();

  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

  //cargar los datos en el formulario cuando se esta editando
  useEffect(() => {
    //verificamos que cargue el id de la url
    if(params.id) {
      setId(proyecto._id)
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
      setCliente(proyecto.cliente);
    } 
  }, [params])

  //submit del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    //validamos que no hayan campos vacíos
    if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
      mostrarAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return
    }
    //Pasar los datos hacia el provider
    await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente});

    //si se envía el formulario, se limpian los campos
    setId(null);
    setNombre('');
    setDescripcion('');
    setFechaEntrega('');
    setCliente('');
    
  };

  const {msg} = alerta;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-10 px-5 md:w-1/2 rounded"
    >
      <div className="mb-5">
        <label 
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="nombre"
        >
          Nombre Proyecto
        </label>
        <input 
          type="text" 
          id="nombre" 
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Proyecto"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label 
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="descripcion"
        >
          Descripción
        </label>
        <textarea 
          type="text" 
          id="descripcion" 
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripción del Proyecto"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label 
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="fecha-entrega"
        >
          Fecha Entrega
        </label>
        <input 
          type="date" 
          id="fecha-entrega" 
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={fechaEntrega}
          onChange={e => setFechaEntrega(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label 
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="cliente"
        >
          Cliente
        </label>
        <input 
          type="text" 
          id="cliente" 
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Cliente"
          value={cliente}
          onChange={e => setCliente(e.target.value)}
        />
      </div>
      {msg && <Alerta alerta={alerta} />}
      <motion.input 
          variants={variants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
          type="submit" 
          className="mb-5bg-transparent w-full py-3 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700 cursor-pointer"
        />
    </form>
  )
};

export default FormularioProyecto;