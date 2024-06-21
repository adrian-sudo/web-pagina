import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Store } from "../Context/Store";
import { getError } from "../Components/Error";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  // Estados para mensajes de advertencia
  const [nameError, setNameError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [imageError, setImageError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [brandError, setBrandError] = useState("");
  const [countInStockError, setCountInStockError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Limpia los mensajes de advertencia previos
    setNameError("");
    setSlugError("");
    setPriceError("");
    setImageError("");
    setCategoryError("");
    setBrandError("");
    setCountInStockError("");
    setDescriptionError("");

    let isValid = true;

    // Validación del nombre
    if (name.length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validación del link (slug)
    if (slug.length < 3) {
      setSlugError("El link debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validación del precio
    if (parseFloat(price) <= 1) {
      setPriceError("El precio debe ser mayor a 1");
      isValid = false;
    }

    // Validación de la imagen (formato y obligatoriedad)
    // if (!image) {
    //   setImageError("Debe seleccionar una imagen");
    //   isValid = false;
    // } else if (!/\.(jpg|jpeg|png)$/i.test(image)) {
    //   setImageError("La imagen debe estar en formato JPG o PNG");
    //   isValid = false;
    // }

    // Validación de la categoría
    if (category.length < 3) {
      setCategoryError("La categoría debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validación de la marca
    if (brand.length < 3) {
      setBrandError("La marca debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validación del stock del producto
    if (parseInt(countInStock) <= 1) {
      setCountInStockError("El stock del producto debe ser mayor que 1");
      isValid = false;
    }

    // Validación de la descripción (menor a 300 caracteres)
    if (description.length >= 300) {
      setDescriptionError("La descripción debe tener menos de 300 caracteres");
      isValid = false;
    }

    if (!isValid) {
      // Al menos una validación falló, no se envía la solicitud
      return;
    }

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("¡Producto actualizado exitosamente!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });

      toast.success("¡Imagen actualizada!");
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Editar producto ${productId}</title>
      </Helmet>
      <h1>Editar producto {productId}</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {nameError && <div className="text-danger">{nameError}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Link:</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            {slugError && <div className="text-danger">{slugError}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Precio: </Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {priceError && <div className="text-danger">{priceError}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Imagen:</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            {imageError && <div className="text-danger">{imageError}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Actualizar imagen:</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Categoria:</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            {categoryError && (
              <div className="text-danger">{categoryError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Marca:</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            {brandError && <div className="text-danger">{brandError}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Stock del producto:</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
            {countInStockError && (
              <div className="text-danger">{countInStockError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {descriptionError && (
              <div className="text-danger">{descriptionError}</div>
            )}
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Actualizar producto
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
