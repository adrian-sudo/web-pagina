//Creamos el componente "Barra de busqueda"
//Hacemos las importaciones necesarias
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useNavigate } from "react-router-dom";

//Definimos "SearchBox" y exportamos una función
export default function SearchBox() {
  const navigate = useNavigate(); //Utilizamos "useNavigate" para acceder a la función "navigate" que se utiliza para camibar la URL actual del navegador
  const [query, setQuery] = useState(""); //Utilizamos "useState" para crear un estado local "query", este representa el termino actual de busqueda
  //Definimos a "submitHandler" el cuál se encarga de manejar el proceso de envío del formulario
  const submitHandler = (e) => {
    e.preventDefault(); //Evitamos que la pagina se recargue con "preventDefault"
    navigate(query ? `/search/?query=${query}` : "/search"); //Utilizamos a "navigate" para cambiar la URL actual por "/search", "query" es el termino que se esta buscando
    e.target.reset();
  };

  //Retornamos
  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
