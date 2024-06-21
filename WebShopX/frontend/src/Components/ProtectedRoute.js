//Con este componente le damos el acceso a las rutas protegidas a los usuario solo si estos han iniciado sesión
//Hacemos las importaciones necesarias
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Context/Store";

//Definimos a "ProtectedRoute", este exporta una función y toma a "children" como parámetro
export default function ProtectedRoute({ children }) {
  const { state } = useContext(Store); //Usamos a "useContext" para acceder al estado global de la aplicación
  const { userInfo } = state; //Optenemos la propiedad "userInfo" del objeto "state"
  return userInfo ? children : <Navigate to="/signin" />; //Verificamos si el usuario inicio sesión, si es así, renderizamos los children, si no, lo envíamos a iniciar sesión
}
