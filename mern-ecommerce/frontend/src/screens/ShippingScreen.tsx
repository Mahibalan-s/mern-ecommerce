import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import type { RootState } from '../store';

const ShippingScreen = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className='form-container'>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control type='text' value={address} onChange={(e) => setAddress(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control type='text' value={city} onChange={(e) => setCity(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control type='text' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control type='text' value={country} onChange={(e) => setCountry(e.target.value)} required />
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-4'>Continue</Button>
      </Form>
      <>
      <CheckoutSteps step1 step2 />
      <div className='form-container'>
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
            {/* ... keep the same Form.Groups for address, city, etc. from before ... */}
            <Button type='submit' variant='primary' className='mt-4'>Continue</Button>
        </Form>
      </div>
    </>
    </div>
    
  );
};

export default ShippingScreen;