//Componenete NavBar
//Hacemos las importaciones necesarias
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo_Header from "../Logos/Logo-Header.png";
import Badge from "react-bootstrap/esm/Badge";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/Nav";
import SearchBox from "../../Components/SearchBox";
import { useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Store } from "../../Context/Store";
import "./NavBar.css";

//Definimos al componente "NavBar" y exportamos su función
export default function NavBar() {
  const { state, dispatch: ctxDispatch } = useContext(Store); //Accedemos al estado global de la aplicación
  const { cart, userInfo } = state; //Obtenemos las propiedades cart y userInfo

  //Definimos a "signoutHandler" esta se encarga de manejar el cierre de sesión
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" }); //Acción "USER_SIGNOUT" esta actualiza el estado global
    localStorage.removeItem("userInfo"); //Eliminamos la información del usuario
    localStorage.removeItem("shippingAddress"); //Eliminamos la información de la pagina de envios
    localStorage.removeItem("paymentMethod"); //Eliminamos la información de metodos de pago
    localStorage.removeItem("cartItems"); //Eliminamos los items del carrito de compras
    window.location.href = "/signin"; //Redirigimos al usuario a la pagina de inicio de sesión
  };

  //Retornamos
  return (
    <header>
      <Navbar className="Navbar" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="Logo">
              <img src={Logo_Header} alt="Logo" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="me-auto w-100 justify-content-end">
              <Link to="/cart" className="nav-link">
                Carrito de compras
                {/* Si la cantidad de productos es mayor a 0 los mostramos en el componete "Bandge" */}
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {/* Utilizamos el metodo "reducer" en la prpiedad "cartItems" del objeto "cart" para calcular cantidad de productos en el carrito */}
                    {/* Acumulamos los valores de los elemenetos en un array, los sumamos para obtener la cantidad total de articulos en el carrito */}
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Mi perfil</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Historial de compras</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Cerrar sesión
                  </Link>
                </NavDropdown>
              ) : (
                <div className="user-icon-container">
                  <Link className="nav-link" to="/signin">
                    Iniciar sesión
                  </Link>
                </div>
              )}
              {/* Si el usuario es administrado mostramos la siguiente información */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Administrador" id="admin-nav-dropdown">
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Panel de información</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Administrar usuarios</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Administrar productos</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Registro de ordenes</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
}
