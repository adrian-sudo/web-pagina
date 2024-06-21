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

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  // Estados para mensajes de advertencia
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  // Función para verificar si el correo electrónico ya está en uso
  const checkEmailExists = async () => {
    try {
      const { data } = await Axios.post("/api/users/check-email", {
        email,
      });
      setEmailExists(data.exists);
    } catch (err) {
      // Manejar errores de solicitud aquí
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Limpia los mensajes de advertencia previos
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    // Validación del nombre
    if (name.length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validación del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("El correo electrónico no es válido");
      isValid = false;
    }

    // Validación de la contraseña
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      isValid = false;
    }

    // Validación de la coincidencia de contraseñas
    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    }

    if (!isValid) {
      // Al menos una validación falló, no se envía la solicitud
      return;
    }

    // El formulario es válido, envía la solicitud
    try {
      const { data } = await Axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Registrarse</title>
      </Helmet>
      <h1 className="my-3">Regístrate</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            required
          />
          {nameError && <div className="text-danger">{nameError}</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => {
            setEmail(e.target.value);
            setEmailExists(false);
          }}
          onBlur={checkEmailExists}
          />
          {emailExists && (
            <div className="text-danger">Este correo ya está en uso</div>
          )}
          {emailError && <div className="text-danger">{emailError}</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div className="text-danger">{passwordError}</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirma tu contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPasswordError && (
            <div className="text-danger">{confirmPasswordError}</div>
          )}
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Registrarse</Button>
        </div>

        <div className="mb-3">
          ¿Ya tienes una cuenta?{' '}
          <Link className="Link-signin" to={`/signin?redirect=${redirect}`}>¡Inicia sesión aquí!</Link>
        </div>
      </Form>
    </Container>
  );
}
