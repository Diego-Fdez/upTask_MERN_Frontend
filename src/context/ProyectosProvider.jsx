import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
  const [buscador, setBuscador] = useState(false);

  const navigate = useNavigate();
  const {auth} = useAuth();

  //traer los proyectos creados
  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        //validamos que haya un token
        if (!token) return;

        //configuración del token para enviar los datos a la BD
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await clienteAxios("/proyectos", config);
        setProyectos(data);
      } catch (error) {
        toast.error(error);
      }
    };
    obtenerProyectos();
  }, [auth]);

    //effect para conectarse a socket.io
    useEffect(() => {
      socket = io(import.meta.env.VITE_BACKEND_URL);
    }, []);

  //función que muestra una alerta
  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    //reseteamos la alerta después del tiempo establecido
    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };

  //función que guarda el nuevo proyecto en la BD
  const submitProyecto = async (proyecto) => {
    //verificamos si es nuevo proyecto o se esta editando
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };

  //función que edita un proyecto
  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );
      //sincroniza el state
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );
      setProyectos(proyectosActualizados);
      //Mostrar alerta
      toast.success("Proyecto Actualizado Correctamente");
      //Redireccionar
      navigate("/proyectos");
    } catch (error) {
      toast.error(error);
    }
  };

  //función que guarda un nuevo proyecto
  const nuevoProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      setProyectos([...proyectos, data]);
      toast.success("Proyecto Creado Correctamente");
      //redirigimos al usuario hacia otra página
      setTimeout(() => {
        navigate("/proyectos");
      }, 1500);
    } catch (error) {
      toast.error(error);
    }
  };

  //handle del buscador
  const handleBuscador = async () => {
    setBuscador(!buscador);
  };

  //función que obtiene un proyecto (ID)
  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      setProyecto(data);
      setAlerta({});
    } catch (error) {
      navigate('/proyectos')
      toast.error(error.response.data.msg);
      setTimeout(() => {
        setAlerta({});
      }, 2000);
    }
    setCargando(false);
  };

  //función que elimina un proyecto
  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
      //sincronizar el state
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      setProyectos(proyectosActualizados);
      toast.success(data.msg);
      //redireccionar
      setTimeout(() => {
        navigate("/proyectos");
      }, 1500);
    } catch (error) {
      toast.error(error);
    }
  };

  //función que cambial el state del modalFormularioTarea
  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  //función que guarda la tarea en BD
  const submitTarea = async tarea => {

    //validamos si estamos creando una nueva tarea o editando
    if(tarea?.id) {
      await editarTarea(tarea);
    } else {
      await crearTarea(tarea);
    }
  };

  //función que crea una nueva tarea
  const crearTarea = async tarea => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.post('/tareas' , tarea, config);
      
      setModalFormularioTarea(false);
      toast.success('Tarea Creada Correctamente');
      //socket.io
      socket.emit('nueva tarea', data);
    } catch (error) {
      toast.error(error);
    }
  };

  //función que edita una tarea
  const editarTarea = async tarea => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config);
      
      setModalFormularioTarea(false);
      //socket
      socket.emit('editar tarea', data);
    } catch (error) {
      toast.error(error);
    }
  };


  //función que carga los datos en el modal para editar una tarea
  const handleModalEditarTarea = async tarea => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  //función que cambia el estado al modalEliminarTarea
  const handleModalEliminarTarea = tarea => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  //función que elimina una tarea
  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config);
      toast.success(data.msg);
      
      setModalEliminarTarea(false);
      
      //socket
      socket.emit('eliminar tarea', tarea);
      setTarea({});
    } catch (error) {
      toast.error(error);
    }
  };

  //función que busca si existe el correo del colaborador en la BD
  const submitColaborador = async email => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config);
      setColaborador(data);
      setAlerta({});
    } catch (error) {
      toast.error(error.response.data.msg);
    }
    setCargando(false);
  };

  //función que agrega colaborador al proyecto
  const agregarColaborador = async email => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
      toast.success(data.msg);
      setColaborador({});

      setTimeout(() => {
        setAlerta({});
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
    setColaborador({});
  };

  //función que cambia el state al modalEliminarColaborador
  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  };

  //función que elimina un colaborador
  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);
      const proyectoActualizado = {...proyecto};
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorSate => colaboradorSate._id !== colaborador._id);
      setProyecto(proyectoActualizado);
      toast.success(data.msg);
      setColaborador({});
      setModalEliminarColaborador(false);
      setTimeout(() => {
        setAlerta({});
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  //función que modifica el estado de la tarea
  const completarTarea = async id => {
    try {
      const token = localStorage.getItem("token");
      //validamos que haya un token
      if (!token) return;

      //configuración del token para enviar los datos a la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);
      //socket
      socket.emit('completar tarea', data)
      setTarea({});
      setAlerta({});
    } catch (error) {
      toast.error(error.response.data.smg);
    }
  };

  //función que agrega las tareas nuevas del socket al state
  const submitTareasProyecto = tarea => {
    //agrega la tarea al State
    const proyectoActualizado = {...proyecto};
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyecto(proyectoActualizado);
  };

  //Socket Tareas eliminadas
  const eliminarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto};
      proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      tareaState => tareaState._id !== tarea._id
      );
      setProyecto(proyectoActualizado);
  };

  //Socket Tareas editadas
  const editarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto};
    proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => 
    tareaState._id === tarea._id ? tarea : tareaState);
    setProyecto(proyectoActualizado);
  };

  //socket de completar tareas
  const completaTarea = tarea => {
    const proyectoActualizado = {...proyecto};
      proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>
      tareaState._id === tarea._id ? tarea : tareaState);
      setProyecto(proyectoActualizado);
  };

  //función que cierra la sesión
  const cerrarSesionProyectos = () => {
    setProyectos([]);
    setProyecto({});
    setAlerta({});
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea, 
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        modalEliminarColaborador,
        handleModalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        editarTareaProyecto,
        completaTarea,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
