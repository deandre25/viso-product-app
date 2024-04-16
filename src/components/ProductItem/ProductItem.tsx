import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating?: number;
  stock?: number;
  brand: string;
  category: string;
  thumbnail: string;
}

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Card style={{ width: '18rem', height: '100%' }} className="mb-3 d-flex flex-column">
      <Card.Img 
        variant="top" 
        src={product.thumbnail} 
        alt={product.title} 
        style={{ objectFit: 'cover', height: '200px' }} 
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>
        <Card.Text className="flex-grow-1">{product.description}</Card.Text>
        <Card.Text>
          <strong>Price:</strong> ${discountedPrice.toFixed(2)} 
          <span className="ml-2 text-muted">
            <s>${product.price.toFixed(2)}</s> ({product.discountPercentage}% off)
          </span>
        </Card.Text>
        <Card.Text>
          <strong>Brand:</strong> {product.brand}
        </Card.Text>
        <Card.Text className="mt-auto">
          <strong>Category:</strong> {product.category}
        </Card.Text>
        <Link to={`/product/${product.id}`} className="btn btn-secondary mr-2 mb-2">View Details</Link>
        <Button variant="primary" className="mt-auto">Buy Now</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductItem;
