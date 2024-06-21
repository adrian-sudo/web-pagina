//Aqui creamos los mensaje de alerta que se le mostrara al usuario
import Alert from "react-bootstrap/Alert"; //Usamos Alert de bootstrap para mostrar mensaje de alerta o información

//Definimos el componente "MessageBox" y exportamos la funcón que toma como objeto a "props" como parámetro
export default function MessageBox(props) {
  // Utilizamos a variant pasada como prop al componente, si no se proporciona, el valor predeterminado es "info"
  return <Alert variant={props.variant || "info"}>{props.children}</Alert>; //El contenido del mensaje se pasa como "children" al compenete "MessageBox"
}