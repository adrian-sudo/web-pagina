//Definimos la función "getError" y la exportamos
export const getError = (error) => { //Le pasamos a "error" como parametro
    return error.response && error.response.data.message //Si error tiene una propiedad response y "response.data.message" existe...
    ? error.response.data.message //Devolvemos el valor de la propiedad
    : error.message; //Si no enviamos el mensaje de error proporcionado por "error"
};