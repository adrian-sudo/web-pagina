import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener productos." });
  }
};

const PAGE_SIZE = 6;
export const getAllProductsAdmin = async (req, res) => {
  const { query } = req; //Obtenemos los parametros de busqueda de la solicitud HTTP con "req.query"
  const page = query.page || 1; //Definimos el parametro para la pagina actual
  const pageSize = query.pageSize || PAGE_SIZE; //Definimos el tamaño de la pagina
  //Realizamos la consulta en la base de datos
  const products = await Product.find()
    .skip(pageSize * (page - 1)) //Utilizamos "Skip" para saltar los productos que ya hemos mostrado en paginas anteriores, es decir para que no se repitan
    .limit(pageSize); //Utilizamos "limit" para limitar el número de productos que se devuelven en cada página

  const countProducts = await Product.countDocuments(); //Contamos el número total de productos en la base de datos utilizando el método "countDocuments" del modelo "Product"
  //Enviamos la respuesta HTTP en formato JSON que contiene todo lo anterior
  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: "Nombre del producto" + Date.now(),
      slug: "nombre-del-producto-como-link" + Date.now(),
      image: "/images/p1.jpg",
      price: 0,
      category: "Ej: Autos, zapatos, ropa, tecnología, etc.",
      brand: "Marca del producto",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "¡Describe tu producto aquí!",
    });
    const product = await newProduct.save();
    res.send({ message: "Producto agregado correctamente", product });
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el producto." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: "¡Producto actualizado con éxito!" });
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el producto." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.send({ message: "¡Producto eliminado con éxito!" });
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el producto." });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res.status(400).send({ message: "¡Ya hiciste un comentario!" });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "¡Comentario agregado con éxito!",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el comentario." });
  }
};

export const getProductSearch = async (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_SIZE; //Definimos el tamaño de la pagina
  const page = query.page || 1; //Pagina actual
  const category = query.category || ""; //Categoria
  const price = query.price || ""; //Precio
  const rating = query.rating || ""; //Clificacion
  const order = query.order || ""; //Orden
  const searchQuery = query.query || "";
  //Definimos los filtros de busqueda
  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  //Buscamos por categoria
  const categoryFilter = category && category !== "all" ? { category } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  //Buscamos por precio
  const priceFilter =
    price && price !== "all"
      ? {
          // 1-50
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};
  //Definimos el orden en que se devolveran los productos
  const sortOrder =
    order === "featured"
      ? { featured: -1 }
      : order === "lowest"
      ? { price: 1 }
      : order === "highest"
      ? { price: -1 }
      : order === "toprated"
      ? { rating: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };
  //Realizamos la consulta en la base de datos con los filtros aplicados anteriormente
  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    //Se aplican los filtros definidos anteriormente y se ordenan los resultados según el orden definido en "sortOrder"
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  //Contamos los productos que coincides con los filtros utilizando el metodo "countDocuments" del modelo "Product"
  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  //Se envia la respuesta HTTP en formato JSON con los productos encontrados que cuentan con todos los filtros
  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find({ category });
    res.send(products);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener productos por categoría." });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el producto por slug." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el producto por ID." });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener las categorías de productos." });
  }
};
