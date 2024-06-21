//En esta pagina mostramos el panel de información o "Dashboard"
//Hacemos las importaciones necesarias
import { useContext, useEffect, useReducer } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import { Store } from "../Context/Store";
import { getError } from "../Components/Error";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

//Definimos la función "reducer" la cual utilizamos para actualizar el estado de la aplicación
const reducer = (state, action) => {
  //Cada caso devuelve un nuevo objeto de estado con las propiedades "loading", "orders", y "error" actualizadas según corresponda
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

//Definimos al componente "DashboardScreen" y lo exportamos como valor predeterminado
export default function DashboardScreen() {
  //Utilizamos el hook "useReducer" para definir el estado inicial de la aplicación y la función "reducer" que se utilizará para actualizar el estado en respuesta a acciones
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  //Utilizamos el hook "useContext" para obtener el estado global de la aplicación a través del contexto Store
  const { state } = useContext(Store);
  const { userInfo } = state; //El objeto state contiene información sobre el usuario actualmente autenticado

  //Utilizamos el hook "useEffect" para realizar una solicitud HTTP a la API utilizando Axios
  useEffect(() => {
    //La solicitud se realiza en una función asíncrona llamada "fetchData"
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        //Si la solicitud es exitosa, se envía una acción al reducer con un tipo "FETCH_FAIL" y un objeto "payload" que contiene los datos obtenidos de la API
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        //Si la solicitud falla, se envía una acción al reducer con un tipo "FETCH_FAIL" y un objeto "payload" que contiene al error
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Panel de información</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Usuarios</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Ordenes</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Total de compras</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>Ventas</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>Aún no hay ventas</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Cargando graficas...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categorias</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No hay categorias</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>cargando graficas...</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
