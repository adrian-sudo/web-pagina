//Aqui manejamos el estado global de la aplicación
//Hacemos las importaciones necesarias
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  //Guardamos la informacion del usuario en el localStorage
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  //Guardamos la informacion del usuario en el localStorage
  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

//Implementamos la funcion reducer para agregar y quitar items al carrito
function reducer(state, action) {
  switch (action.type) {
    //Caso agregar item al carrito
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      //Guardamos los items en el localStorage de la pagina para que al momneto de actualizarla no se quiten
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    //Caso eliminar item del carrito
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      //Guardamos los items en el localStorage de la pagina para que al momneto de actualizarla no se quiten
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    //Caso limpiar carrito
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    //Caso iniciar sesión
    //Actualiza la informacion en funcion de los datos que obtenemos de Backend
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    //Caso cerrar sesión
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [], //Vaciamos el carrito
          shippingAddress: {}, //Vaciamos los campos en dirección de envío
          paymentMethod: "", //Vaciamos los campos en metodos de pago
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}
//Definimos a "StoreProvider"
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
