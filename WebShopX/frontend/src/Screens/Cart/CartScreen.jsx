import "./Cart.css";
import { useContext } from "react";
import { Store } from "../../Context/Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import MessageBox from "../../Components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import axios from "axios";

export default function CartScreen() {
  const navigate = useNavigate(); //Variable "navigate"
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  //Creamos la constante actualizar carrito
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      //verificamos si el producto se encuentra disponible atravez del stock
      window.alert("Lo sentimos... El producto se encuentra agotado :( "); // si no es asi enviamos el mensaje
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  //Creamos la constante remover del carrito
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  //Creamos la constante para el boton de pago
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping"); //Le pasamos el link atravez de la vairable "navigate"
  };

  return (
    <div>
      <Helmet>
        <title>Carrito de compras</title>
      </Helmet>
      <h1>Carrito de compras</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? ( //Si el carrito esta vacio (0), se va a mostrar en la ventana el mensaje
            <MessageBox>
              El carrito esta vacio <Link to="/">Ir de compras</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="aling-itmes-center">
                    <Col md={4}>
                      <img
                        src={item.image} // Pasamos la imagen del producto
                        alt={item.name} // Mostramos el nombre si la imagen no carga
                        className="img-fluid rounded img-thumbnail"
                      ></img>{" "}
                      {/*Creamos el link del producto para el carrito*/}
                      <Link
                        className="product-title-cart"
                        to={`/product/${item.slug}`}
                      >
                        {item.name}
                      </Link>{" "}
                    </Col>
                    <Col md={3}>
                      {/*El boton solo se activa si la catidad del producto es 1 o mayor*/}
                      <Button
                        onClick={
                          () => updateCartHandler(item, item.quantity - 1) //Le pasamos la funcion actualizar el carrito eliminandole 1
                        }
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        {" "}
                        {/* Importamos el icono de menos*/}
                        <i className="fas fa-minus-circle"></i>{" "}
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        variant="light"
                        onClick={
                          () => updateCartHandler(item, item.quantity + 1) //Le pasamos la funcion actualizar el carrito aumentandole 1
                        }
                        //Si el stock del producto llega al maximo el boton se desactiva automaticamente
                        disabled={item.quantity === item.countInStock}
                      >
                        {" "}
                        {/* Importamos el icono de mas*/}
                        <i className="fas fa-plus-circle"></i>{" "}
                      </Button>
                    </Col>
                    <Col md={3}>USD: $ {item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)} //Le pasamos la funcion eliminar del carrito
                        variant="light"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Total a pagar ({/*Sumamos la cantidad de productos */}
                    {cartItems.reduce((a, c) => a + c.quantity, 0)} productos) :
                    $
                    {cartItems.reduce(
                      // Multiplicamos la cantidad de productos por su precio
                      (a, c) => a + c.price * c.quantity,
                      0
                    )}{" "}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/*Creamos el boton de pagar en la seccion de carrito */}
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0} //Si el carrito esta vacio (0 items) el boton se encontrara desactivado
                    >
                      Proceder al pago
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
