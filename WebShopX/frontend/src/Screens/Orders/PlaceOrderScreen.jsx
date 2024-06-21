//Pantalla de factura o "OrderScreen"

import "./Styles.css";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Store } from "../../Context/Store";
import CheckoutSteps from "../../Components/CheckoutSteps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import LoadingBox from "../../Components/LoadingBox";
import Axios from "axios";
import { getError } from "../../Components/Error";
import { toast } from "react-toastify";
import "./Styles.css";

//Creamos la función reducer para los siguentes casos
const reducer = (state, action) => {
  //Recibimos el estado actual y la accion
  switch (action.type) {
    //En cada caso se devuelve un nuevo objetode estado con la propiedad loading que se establace en true o false según corresponda
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
  //Si la acción no coincide con ninguno de los casos devolvemos el estado actual
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate(); //Obtenemos la función de navegación del enretador

  const { state, dispatch: ctxDispatch } = useContext(Store); //Usamos "useContext" para obtener el estado global de la acplicación y la función "dispacth"
  const { cart, userInfo } = state; //Desestructuramos para obtener la propiedades "cart" y "userInfo"

  //Objeto "loading" establecida en false
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  //Calculamos el precio total de los elementos del carrito, incluyendo el precio de envío y impuesto
  //Función "round2"
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //Redondeamos un número a 2 decimales: 123.2345 => 123.23
  cart.itemsPrice = round2(
    //Función "itemsPrice" del objeto "cart" recibe el resultado de la función "reducer"
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0) //Con la función "reducer" calculamos el precio total del carrito, multiplicando la cantidad del produc por su precio
  );
  //Propieda "shippingPrice" esta propiedad calcula el precio del envío
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10); //Si el precio total es mayor a 100 el costo del envío es 0, si no, es 10
  cart.taxPrice = round2(0.15 * cart.itemsPrice); //Calculamos el impuesto, es el 15% de la venta, se le asigna a la propiedad "taxPrice"
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice; //Calculamos el precio total sumando todo lo anterior, se le asigna a la propiedad "totalPrice"

  //Función "placeOrderHandler" esta hace una solicitud POST a la API para crear una orden
  const placeOrderHandler = async () => {
    try {
      //Función "dispatch" de tipo "CREATE_REQUEST"
      dispatch({ type: "CREATE_REQUEST" }); //Realizamos una solicitud de pedido
      //Si la solicitud tiene éxito envíamos una acción a "CREATED_SUCCESS"
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          //Autenticamos al usuario en la API para permitir la solicitud POST y asi crear una nueva orden
          headers: {
            authorization: `Bearer ${userInfo.token}`, //Utilizamos el esquema "Bearer" que es un estándar de autenticación HTTP
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      //Función "CREATE_SUCCESS" redirige al usuario a la página de detalles de la orden
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      //Si la solicitud falla se envía una acción a "CREATE_FAIL" y le muestra una mensaje de error al usuario
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };
  //Este hook verifica si se selecciono un metodo de pago antes de realizar el pedido
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment"); //Si no se ha seleccionado un método, se redirige al usuario a la pagina de sección de pago
    }
  }, [cart, navigate]);
  //Retornamos todo en la pagina
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Factura</title>
      </Helmet>
      <h1 className="my-3">Vista previa de factura</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Envío</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Dirección: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link className="edit-info" to="/shipping">
                <FontAwesomeIcon
                  className="icon-edit-info"
                  icon={faPenToSquare}
                />
                Editar informacion de envío
              </Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pago</Card.Title>
              <Card.Text>
                <strong>Metodo: </strong> {cart.paymentMethod}
              </Card.Text>
              <Link className="edit-info" to="/payment">
                <FontAwesomeIcon
                  className="icon-edit-info"
                  icon={faPenToSquare}
                />
                Editar informacion de pago
              </Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Artículos:</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link
                          className="link-product-placeorder"
                          to={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>Cantidad: {item.quantity}</span>
                      </Col>
                      <Col md={3}>Precio: ${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link className="edit-info" to="/cart">
                <FontAwesomeIcon
                  className="icon-edit-info"
                  icon={faPenToSquare}
                />
                Editar carrito de compras
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumen del pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Precio del artículo:</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envío:</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Impuestos:</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total a pagar: </strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Realizar pedido
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
