import mongoose from "mongoose"; //Importamos "mongoose" para modelar el objeto para MogoDb

//Definimos el esquema "orderSchema" utilizandola función "mongoose.Schema"
const orderSchema = new mongoose.Schema(
  {
    //Matriz que representa a los articulos de la orden
    orderItems: [
      {
        //Propiedades de los articulos
        slug: { type: String, required: true }, //Link
        name: { type: String, required: true }, //Nombre
        quantity: { type: Number, required: true }, //Cantidad
        image: { type: String, required: true }, //Imagen
        price: { type: Number, required: true }, //Precio
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    //Objeto que representa la dirección de envío de la orden
    shippingAddress: {
      //Propiedades del objeto
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true }, //Esta cadena contiene el metodo de pago utilizado para la orden

    //Este objeto contiene la información sobre el resultado del pago
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true }, //Precio del articulo
    shippingPrice: { type: Number, required: true }, //Precio del envio
    taxPrice: { type: Number, required: true }, //Precio del impuesto
    totalPrice: { type: Number, required: true }, //Total a pagar
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //Referenciamos al usuario que realizó la orden
    isPaid: { type: Boolean, default: false }, //Indicamos si la orden fue pagada
    paidAt: { type: Date }, //Indicamos la fecha si la orden fue entregada
    isDelivered: { type: Boolean, default: false }, //Fecha de cuando se realizó el pago
    deliveredAt: { type: Date }, //Fecha de cuando se entregó la orden
  },
  {
    timestamps: true, //Lo utilizamos par agregrar automáticamente las propiedades "createdAt" y "updateAt" a cada documeto creado a partir de este esquema
  }
);
//Utilizamos "mongoose.model" para crear el modelo "Order" en la base de datos
const Order = mongoose.model("Order", orderSchema);
//Exportamos
export default Order;
