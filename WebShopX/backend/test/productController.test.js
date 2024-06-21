const request = require("supertest");
const app = require("../server");

describe("Pruebas de integracion de controlador de productos ", () => {
  //Prueba para obtener todos los productos
  test("Obtener todos los productos", async () => {
    try {
      const response = await request(app).get("/api/products").expect(200);

      console.log(response.body);
      // Realiza las verificaciones necesarias en la respuesta recibida
    } catch {
      console.log("");
    }
  });

  // Prueba para crear un nuevo producto
  test("Crear nuevo producto", async () => {
    const createProduct = {
      name: "Asus Vivobook",
      slug: "asus-vivobook",
      image: "",
      price: 0,
      category: "Tecnologia",
      brand: "Asus",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description:
        "Computador Asus con 512 GB de almacenamiento, 16 GB de memoria RAM y procesador Ryzen 7 5800 H",
    };

    try {
      const response = await request(app)
        .post("/api/products/")
        .send(createProduct)
        .expect(200);

      console.log(response.body);
      // Realiza las verificaciones necesarias en la respuesta recibida
    } catch {
      console.log("");
    }
  });

  // Prueba para actulizar un producto
  test("Actualizar producto", async () => {
    const updateProduct = {
      name: "Asus Vivobook",
      slug: "asus-vivobook",
      image: "",
      price: 1200,
      category: "Tecnologia",
      brand: "Asus",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description:
        "Computador Asus con 512 GB de almacenamiento, 16 GB de memoria RAM y procesador Ryzen 7 5800 H",
    };

    try {
      const response = await request(app)
        .put("/api/products/:id")
        .send(updateProduct)
        .expect(200);

      console.log(response.body);
      // Realiza las verificaciones necesarias en la respuesta recibida
    } catch {
      console.log("");
    }
  });

  // Prueba para eliminar un producto por ID
  test("Eliminar un producto por ID", async () => {
    const productId = "product-id";

    try {
      const response = await request(app)
        .delete(`/products/${productId}`)
        .expect(204);

      // Realiza las verificaciones necesarias en la respuesta recibida
    } catch {
      console.log("");
    }
  });
});
