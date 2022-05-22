import { useState } from "react";
import { motion } from "framer-motion";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioColaborador = () => {

  const [email, setEmail] = useState("");

  const {mostrarAlerta, alerta, submitColaborador} = useProyectos();

  //validamos que no hayan campos vacíos en el formulario
  const handleSubmit = e => {
    e.preventDefault();
    if(email === '') {
      mostrarAlerta({
        msg: "El correo es obligatorio",
        error: true
      });
      return
    };

    submitColaborador(email);

  };

  const {msg} = alerta;

  return (
    <form 
      className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg' 
      onSubmit={handleSubmit}
    >
      <div className='mb-5'>
        <label
          htmlFor='email'
          className='text-gray-700 uppercase font-bold text-sm'
        >
          Correo Colaborador(a)
        </label>
        <input
          type='email'
          id='email'
          placeholder='Correo del Colaborador'
          className='border-2 w-full p-2 mt-2 placeholder:-gray-400 rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {msg && <Alerta alerta={alerta} />}
      <motion.input
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        value="Buscar Colaborador"
        type='submit'
        className=' bg-transparent cursor-pointer text-sm w-full py-2 border-2 border-sky-700 text-sky-700 uppercase font-bold rounded transition-all hover:text-white hover:bg-sky-700'
      />
    </form>
  );
};

export default FormularioColaborador;
