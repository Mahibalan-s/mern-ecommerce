import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    // ✅ FIX 1: THE MISSING DATA FETCH
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/orders/${orderId}`);
                setOrder(data);
                setLoading(false);
            } catch (err: any) {
                setError(err?.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    // ✅ FIX 2: IMPROVED PAYPAL SCRIPT LOADING
    useEffect(() => {
        if (order && !order.isPaid) {
            if (!window.paypal) {
                const addPayPalScript = async () => {
                    paypalDispatch({
                        type: 'resetOptions',
                        value: {
                            'client-id': 'AfVelYO5MxviBobTYG8Ekh0LhgQ0W4Fy-sUaBbh1dd74e5uxi_2Mn-Vd-UzWfI569N09vY1UPkxxtx7L',
                            currency: 'USD',
                        },
                    });
                    paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
                };
                addPayPalScript();
            }
        }
    }, [order, paypalDispatch]);

    const createOrder = (data: any, actions: any) => {
    return actions.order.create({
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: "10.00", // Forced test value
                },
            },
        ],
    });
};

    const onApprove = (data: any, actions: any) => {
        return actions.order.capture().then(async function (details: any) {
            try {
                await axios.put(`/api/orders/${order._id}/pay`, details);
                alert('Payment Successful!');
                window.location.reload();
            } catch (err: any) {
                alert(err?.response?.data?.message || err.message);
            }
        });
    };

    if (loading) return <div>Loading Order Data...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong> {order.user.email}</p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <div className="alert alert-success">Delivered on {order.deliveredAt}</div>
                            ) : (
                                <div className="alert alert-danger">Not Delivered</div>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p><strong>Method: </strong>{order.paymentMethod}</p>
                            {order.isPaid ? (
                                <div className="alert alert-success">Paid on {order.paidAt}</div>
                            ) : (
                                <div className="alert alert-danger">Not Paid</div>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item: any, index: number) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={`http://localhost:5000${item.image}`} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                                            <Col md={4}>{item.qty} x ${item.price} = ${item.qty * item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Items</Col><Col>${order.itemsPrice}</Col></Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Shipping</Col><Col>${order.shippingPrice}</Col></Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Tax</Col><Col>${order.taxPrice}</Col></Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Total</Col><Col>${order.totalPrice}</Col></Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {isPending ? <div>Loading PayPal...</div> : (
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;