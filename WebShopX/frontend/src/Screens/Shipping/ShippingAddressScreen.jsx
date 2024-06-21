import "./Style.css";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Context/Store";
import CheckoutSteps from "../../Components/CheckoutSteps";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  // Estados para mensajes de advertencia
  const [fullNameError, setFullNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cityError, setCityError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [countryError, setCountryError] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Limpia los mensajes de advertencia previos
    setFullNameError("");
    setAddressError("");
    setCityError("");
    setPostalCodeError("");
    setCountryError("");

    let isValid = true;

    // Validación del nombre
    if (fullName.length < 5) {
      setFullNameError("El nombre debe tener al menos 5 caracteres");
      isValid = false;
    }

    // Validación de la dirección
    if (address.length < 5) {
      setAddressError("La dirección debe tener al menos 5 caracteres");
      isValid = false;
    }

    // Validación de la ciudad
    if (city.length < 3) {
      setCityError("La ciudad debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validación del código postal
  

    // Validación del país
    if (country.length < 3) {
      setCountryError("El país debe tener al menos 3 caracteres");
      isValid = false;
    }

    if (!isValid) {
      // Al menos una validación falló, no se envía la solicitud
      return;
    }

    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );

    navigate("/payment");
  };

  return (
    <div>
      <Helmet>
        <title>Dirección de Envío</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Dirección de Envío</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {fullNameError && (
              <div className="text-danger">{fullNameError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            {addressError && (
              <div className="text-danger">{addressError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            {cityError && <div className="text-danger">{cityError}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Código postal</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
            {postalCodeError && (
              <div className="text-danger">{postalCodeError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>País</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            {countryError && (
              <div className="text-danger">{countryError}</div>
            )}
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
