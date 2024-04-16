import React, { useState, useEffect } from 'react';
import { Card, Button, Carousel, ListGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

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
  images: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<Product | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`https://dummyjson.com/products/${id}`); 
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center mt-5">Product not found</div>;
  }

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Card className="mb-3 shadow-sm">
      <Carousel interval={null}>
        {product.images.map((image, index) => (
          <Carousel.Item key={index}>
            <img 
              className="d-block w-100 rounded-top"
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <Card.Body>
        <Card.Title className="h4">{product.title}</Card.Title>
        <Card.Text className="text-muted mb-2">{product.description}</Card.Text>
        
        <ListGroup className="mb-3">
          <ListGroup.Item>
            <strong>Price:</strong> ${discountedPrice.toFixed(2)}
            <span className="text-muted ml-2">
              <s>${product.price.toFixed(2)}</s> ({product.discountPercentage}% off)
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Brand:</strong> {product.brand}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Category:</strong> {product.category}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Rating:</strong> {product.rating}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Stock:</strong> {product.stock} items left
          </ListGroup.Item>
        </ListGroup>

        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="btn btn-secondary">Back to Products</Link>
          <Button variant="primary">Buy Now</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductDetail;
