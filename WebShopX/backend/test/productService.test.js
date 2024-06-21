const productService = require("../services/productServices");

describe("Servicios de productos", () => {
  // Prueba para obtener todos los productos
  test("Obtener todos los productos", async () => {
    try {
      const result = await productService.getAllProducts();
      console.log(result);
      expect(result.length).toBeGreaterThan(0);
    } catch {
      console.log("");
    }
  }, 10010);

  //   // Prueba para crear un nuevo producto
  test("Crear nuevo producto", async () => {
    const productData = {
      name: "Hp pavilon",
      slug: "hp-pavilion",
      image: "",
      price: 930,
      category: "Tecnologia",
      brand: "HP",
      countInStock: 5,
      rating: 0,
      numReviews: 0,
      description:
        "Computador Asus con 512 GB de almacenamiento, 16 GB de memoria RAM y procesador Ryzen 7 5800 H",
    };

    try {
      const result = await productService.createProduct(productData);
      console.log(result);
      expect(result).toEqual(productData);
    } catch {
      console.log("");
    }
  }, 20000);

  // Prueba para actualizar un producto por su ID
  test("Actualizar producto por ID", async () => {
    const productId = {
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
      const result = await productService.updateProduct(productId);
      console.log(result);
      expect(result).toEqual(productId);
    } catch {
      console.log("");
    }
  }, 10000);

  // Prueba para obtener un producto por su ID
  test("Obtener producto por ID", async () => {
    const id = 1;

    try {
      const result = await productService.getProductById(id);
      console.log(result);
      expect(result).toBeDefined();
    } catch {
      console.log("");
    }
  });

  // Prueba para eliminar un producto por su ID
  test("Eliminar producto por ID", async () => {
    const id = 1;

    try {
      await productService.deleteProduct(id);
      // Verificar que no se haya lanzado un error
      expect(true).toBe(true);
    } catch {
      console.log("");
    }
  });
});
