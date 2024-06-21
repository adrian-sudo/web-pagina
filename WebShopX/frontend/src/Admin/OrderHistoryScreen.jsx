//En esta pagina mostramos las compras realizadas por el cliente
//Hacemos las importaciones necesarias
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Store } from "../Context/Store";
import { getError } from "../Components/Error";
import Button from "react-bootstrap/esm/Button";

//Definimos la función "reducer" para actualizar el estado de la aplicación
const reducer = (state, action) => {
  //Cada caso devuelve un nuevo objeto de estado con las propiedades "loading", "orders", y "error" actualizadas según corresponda
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

//Definimos a "OrderHistoryScreen" y lo exportamos como valor predeterminado
export default function OrderHistoryScreen() {
  //Se utiliza el hook "useContext" para obtener el estado global de la aplicación a través del contexto "Store"
  const { state } = useContext(Store);
  const { userInfo } = state; //El objeto "state" contiene información sobre el usuario actualmente autenticado
  const navigate = useNavigate(); //Se utiliza el hook "useNavigate" para obtener una función que permite navegar a otras rutas en la aplicación

  //Se utiliza el hook "useReducer" para definir el estado inicial de la aplicación y la función de "reducer" que se utilizará para actualizar el estado en respuesta a acciones
  //L función "dispatch" se utiliza para enviar acciones a la función "reducer"
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //Utiliza el hook "useEffect" para realizar una solicitud HTTP a la API utilizando Axios
  useEffect(() => {
    //La solicitud se realiza en una función asíncrona llamada "fetchData"
    const fetchData = async () => {
      //Esta acción "FETCH_REQUEST" actualiza el estado de la aplicación y establece la propiedad loading en true
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        //Si la solicitud es exitosa, se envía una acción al reducer con un tipo "FETCH_FAIL" y un objeto "payload" que contiene los datos obtenidos de la API
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        //Si la solicitud falla, se envía una acción al reducer con un tipo "FETCH_FAIL" y un objeto "payload" que contiene al error
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]); //Mostramos la informacion del usuario

  return (
    <div>
      <Helmet>
        <title>Historial de compras</title>
      </Helmet>

      <h1>Historial de compras</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>¿Pagado?</th>
              <th>¿Entregado?</th>
              <th>Más</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
