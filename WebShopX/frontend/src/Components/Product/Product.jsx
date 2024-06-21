//Este componente muestra un producto en pantalla y permite al usuario agregarlo al crrito
//Hacemos las impotaciones necesarias
import "./Product.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "../Ratings/Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../../Context/Store";

//Definimos la función "Product", le pasamos a "props" como parámetro
function Product(props) {
  const { product } = props; //Extraemos el objeto "product" de "props"
  const { state, dispatch: ctxDispatch } = useContext(Store); //Usamos "useContext" para acceder al estado global de la aplicación
  const {
    cart: { cartItems }, //Optenemos la propiedad "cartItems" del objeto "cart"
  } = state;

  //Definimos la función "addToCartHandler", esta se encarga de manejar el proceso de agregar un producto al carrito
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id); //Verificamos si el producto ya esta en el carrito con "existItem"
    const quantity = existItem ? existItem.quantity + 1 : 1; //Si es asi, incrementamos la cntidad de uno en uno, si no, se establece en uno
    const { data } = await axios.get(`/api/products/${item._id}`); //Llammos a la api para obtener más información sobre el producto
    //Si el producto no cuenta con el stock disponible para agregar la contidad deseada al crrito...
    if (data.countInStock < quantity) {
      window.alert("Lo sentimos... El producto se encuentra agotado :( "); //Mostramos el siguiente mensaje
      return;
    }
    //De lo contrario se despacha una acción para agregar el producto al carrito con la cantidad especificada
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  //Retornamos
  return (
    //Contenedor de los productos en la pagina principal
    <Card className="Card_product">
      {/*Pasamos el link "slug" del producto al momento de dar click */}
      <Link to={`/Product/${product.slug}`}>
        {/*Pasamos la imagen (image) y el nombre (name) en caso de no cargar la imagen del producto*/}
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link className="product-title" to={`/Product/${product.slug}`}>
          {/*Titulo principal del producto*/}
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {/*Clificaciones de los productos (estrellas)*/}
        <Rating rating={product.rating} numReviews={product.numReviews} />
        {/*Precio del producto */}
        <Card.Text>USD: ${product.price}</Card.Text>
        {/*Verificamos el stock del producto si es = 0, el boton se desactiva automaticamente */}
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            ¡Producto agotado!
          </Button>
        ) : (
          //Boton "Agregar al carrito", le pasamos la funcion onclick para añadirlo al carrito
          <Button onClick={() => addToCartHandler(product)}>
            Agregar al carrito
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product; //Exportamos
