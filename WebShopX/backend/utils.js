import jwt from "jsonwebtoken"; //Importamos la biblioteca "jsonwebtoken", que se utiliza para generar y verificar los tokens.

//Creamos la funcion "generateToken" que se utiliza para generar un token de acceso para un usuario autenticado
export const generateToken = (user) => {
  //Tomamos al objeto "user" como argumento
  return jwt.sign(
    {
      //Propiedades del objeto "user"
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET, //Llamamos a la vairable "JWT_SECRET" para codificar el token
    {
      expiresIn: "30d", //Especificamos que el token expirará en 30 días mediante "expiresIn"
    }
  );
};

//Definimos la funcion "isAuth" esta funcion la utilizamos como middleware para proteger la ruta
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    //La función slice se utiliza para extraer una parte de una cadena.
    //En este caso, "authorization.slice"(7, authorization.length) devuelve una subcadena que comienza en el índice 7
    const token = authorization.slice(7, authorization.length); //El 7 es el indicede donde comienza el token el la cadena de autorización
    //Creamos la funcion de verificación
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      // En caso de error mandamos los mensajes
      if (err) {
        res.status(401).send({ message: "Token invalido" });
      } else {
        //Si el token es valido lo descodificamos
        req.user = decode; //descodificamos al usuario y lo almacenamos en la data
        next(); //Llamamos a next para que la funcion continúe
      }
    });
  } else {
    res.status(401).send({ message: "Sin token" }); //Si el token no es proporcionado envíamaos este mensaje
  }
};

//Definimos la función "isAdmind" para verificar si el usuario es administrador, toma 3 parametros req,res y next
export const isAdmin = (req, res, next) => {
  //Verificamos si el usuario exixte y si es administrador
  if (req.user && req.user.isAdmin) {
    next(); //Si es así llamamos a "next" para pasar la solicitud al middleware
  } else {
    res.status(401).send({ message: "Token de administrador invalido" }); //Si no devolvemos el error
  }
};

