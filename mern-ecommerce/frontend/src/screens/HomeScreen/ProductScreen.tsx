import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../slices/cartSlice';
// Optional: Import your Rating component if you have one
// import Rating from '../components/Rating';

const ProductScreen = () => {
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1); // State for the selected quantity

  const { id: productId } = useParams();
  console.log(productId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Add a slash before api to ensure it's an absolute path
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        // Optional: set an error state here so the screen doesn't stay on "Loading"
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // This function sends the product to Redux and moves user to Cart
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (!product) return <div className="container my-5">Loading...</div>;

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>Go Back</Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>${product.price}</strong></Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                </Row>
              </ListGroup.Item>

              {/* Quantity Selector - Only shows if in stock */}
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className='btn-block'
                  type='button'
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;