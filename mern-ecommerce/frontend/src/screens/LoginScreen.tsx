import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import type { RootState } from '../store';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Hit your backend login route
      const { data } = await axios.post('/api/users/login', { email, password });
      dispatch(setCredentials({ ...data }));
      navigate(redirect);
    } catch (err: any) {
      alert(err?.data?.message || err.error || 'Invalid Credentials');
    }
  };

  return (
    <Row className='justify-content-md-center'>
      <Col xs={12} md={6}>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='mt-2'>
            Sign In
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            New Customer? <Link to='/register'>Register</Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LoginScreen;