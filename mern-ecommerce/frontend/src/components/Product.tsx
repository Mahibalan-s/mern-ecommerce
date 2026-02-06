import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

// We define the shape of our product data for TypeScript
interface ProductProps {
    product: {
        _id: string;
        name: string;
        image: string;
        price: number;
        rating: number;
        numReviews: number;
    };
}

const Product = ({ product }: ProductProps) => {
    return (
        <Card className='my-3 p-3 rounded'>
            {/* We use <Link> instead of <a> to prevent page refreshes */}
            <Link to={`/product/${product._id}`}>
                <Card.Img
                    src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                    variant='top'
                />
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as='div' className='product-title'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div'>
                    <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                    />
                </Card.Text>

                <Card.Text as='h3'>${product.price}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;