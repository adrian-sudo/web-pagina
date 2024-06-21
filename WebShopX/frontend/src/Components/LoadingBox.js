//Esta es la animación de carga de la pagina
import Spinner from "react-bootstrap/Spinner"; //Importamos el spiner de Bootsrap

//Creamos la función "LoadingBox" y la exportamos
export default function LoadingBox() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Cargando...</span>
    </Spinner>
  );
}
