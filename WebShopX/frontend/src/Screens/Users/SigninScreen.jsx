import Axios from "axios";
import "./Styles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Context/Store";
import { toast } from "react-toastify";
import { getError } from "../../Components/Error";

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      //Guardamos la informacion en el local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  //Este useEffect verifica si la informacion de usuario ya existe
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    //Creamos el contenedor principal del Login
    <Container className="small-container">
      <Helmet>
        <title>Iniciar sesión</title>
      </Helmet>
      {/*Titulo principal*/}
      <h1 className="my-3">Iniciar sesion</h1>
      <Form onSubmit={submitHandler}>
        {/*Llamamos al grupo Form  de Bootstrap para el email*/}
        <Form.Group className="mb-3" controlId="email">
          {/*Label para el email */}
          <Form.Label>Email</Form.Label>
          {/*Controlamos que sea de tipo email*/}
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        {/*Llamamos al grupo Form  de Bootstrap para la contraseña*/}
        <Form.Group className="mb-3" controlId="password">
          {/*Label para la contraseña*/}
          <Form.Label>Contraseña</Form.Label>
          {/*Controlamos que se de tipo password*/}
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {/*Creamos el boton de iniciar sesion*/}
        <div className="mb-3">
          <Button type="submit">Iniciar sesión</Button>
        </div>
        {/*Creamos el link para registrarse*/}
        <div className="mb-3">
          ¿No tienes una cuenta?{" "}
          <Link className="Link-checkIn" to={`/signup?redirect=${redirect}`}>
            ¡Registrate!
          </Link>
        </div>
      </Form>
    </Container>
  );
}
