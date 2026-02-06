import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import ProductScreen from './screens/HomeScreen/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoute';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} index={true} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='' element={<PrivateRoute />}>
              <Route path='/shipping' element={<ShippingScreen />} />
            </Route>
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/order/:id' element={<OrderScreen />} />


            {/* Add this line to handle the /cart path */}
            <Route path='/cart' element={<CartScreen />} />

            <Route path='/login' element={<div>Login Screen Placeholder</div>} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;