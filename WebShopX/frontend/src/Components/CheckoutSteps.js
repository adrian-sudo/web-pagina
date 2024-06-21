//Estos son los pasos que se muestran en la parte superior al momento de proceder al pago
//Importamos los componentes necesarios
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//Define un componente "CheckoutSteps" y lo exportamos, toma un objeto "props" como parámetro
export default function CheckoutSteps(props) {
  return (
    //Rederizamos una fila "Row" de 4 columnas "Col"
    <Row className="checkout-steps">
      <Col className={props.step1 ? "active" : ""}>Iniciar sesión</Col>
      <Col className={props.step2 ? "active" : ""}>Envío</Col>
      <Col className={props.step3 ? "active" : ""}>Pago</Col>
      <Col className={props.step4 ? "active" : ""}>Realizar pedido</Col>
    </Row>
  );
}
