import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";

const useAdmin = () => {
  const {proyecto} = useProyectos();
  const {auth} = useAuth();

  //retornamos la verificación de si el creador es el que esta logueado
  return proyecto.creador === auth._id;
};

export default useAdmin;