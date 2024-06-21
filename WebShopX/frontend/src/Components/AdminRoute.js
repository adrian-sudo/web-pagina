//Aqui verificamos si el usuario es administrador o no
//Hacemos las importaciones necesarias
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Context/Store";

//Definimos un componente de ruta "AdminRoute" y lo exportamos
//Tomamos un objeto "Children" como parametro
export default function AdminRoute({ children }) {
  const { state } = useContext(Store); //Accedemos al estado global de la aplicación con el "useContext"
  const { userInfo } = state; //Obtenemos la información del usuario del objeto state
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />; // Verificamos si el usuario que ha iniciado sesión y es un administrador, si es así, el componente renderiza los children que le pasamos como parámetro
  //De lo contrario, redirigimos al usuario a la página de inicio de sesión
}
