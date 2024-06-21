//Hcemos las importaciones necesarias
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./Screens/Home/HomeScreen";
import ProductScreen from "./Screens/Products/ProductScreen";
import Container from "react-bootstrap/Container";
import CartScreen from "./Screens/Cart/CartScreen";
import SigninScreen from "./Screens/Users/SigninScreen";
import ShippingAddressScreen from "./Screens/Shipping/ShippingAddressScreen";
import SignupScreen from "./Screens/Users/SignupScreen";
import PaymentMethodScreen from "./Screens/Payment/PaymentMethodScreen";
import PlaceOrderScreen from "./Screens/Orders/PlaceOrderScreen";
import OrderScreen from "./Screens/Orders/OrderScreen";
import OrderHistoryScreen from "./Admin/OrderHistoryScreen";
import ProfileScreen from "./Screens/Users/ProfileScreen";
import SearchScreen from "./Screens/Products/SearchScreen";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import ProductListScreen from "./Admin/ProductListScreen";
import ProductEditScreen from "./Admin/ProductEditScreen";
import OrderListScreen from './Admin/OrderListScreen';
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import DashboardScreen from "./Admin/DashboardScreen";
import UserListScreen from "./Admin/UserListScreen";
import UserEditScreen from "./Admin/UserEditScreen";

//Creamos la función "App"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <ToastContainer position="bottom-center" limit={1} />
          {/* Lamamos a la NavBar */}
          <NavBar /> 
          <main>
            <Container className="mt-3">
                <Routes>
                  {/* Seccion de rutas */}
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/search" element={<SearchScreen />} />
                  <Route path="/product/:slug" element={<ProductScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route path="/signin" element={<SigninScreen />} />
                  <Route path="/signup" element={<SignupScreen />} />
                  <Route path="/profile" element={ <ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                  <Route path="/shipping" element={<ShippingAddressScreen />} />
                  <Route path="/payment" element={<PaymentMethodScreen />} />
                  <Route path="/placeOrder" element={<PlaceOrderScreen />} />
                  <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
                  <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>}></Route>
                  <Route path="admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>}></Route>
                  <Route path="admin/product/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>}></Route>
                  <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>}></Route>
                  <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>}></Route>
                  <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>}></Route>
                </Routes>
            </Container>
          </main>
          <footer>
          <Footer/>
        </footer>
        </div>
      </BrowserRouter>
    </div>
  );
}
export default App;