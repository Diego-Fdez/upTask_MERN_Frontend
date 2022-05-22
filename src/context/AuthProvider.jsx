import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

  //revisa si ya hay un token
  useEffect(() => {
    //función que autentifica al usuario
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token');
      
      if(!token) {
        setCargando(false);
        return
      }

      //configuraciones para llamar el perfil autenticado de la BD
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      //si hay un token:
      try {
        const { data } = await clienteAxios('/usuarios/perfil', config);
        setAuth(data);
      } catch (error) {
        setAuth({});
      } finally {
        setCargando(false);
      }
    };
    autenticarUsuario();
  }, []);

  //función que cierra la sesión (auth)
  const cerrarSesionAuth = () => {
    setAuth({});
  };

  return (
    <AuthContext.Provider 
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSesionAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};

export {
  AuthProvider
}

export default AuthContext;