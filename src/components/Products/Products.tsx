import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Container, Row, Col, Form, Pagination, Alert, Dropdown } from 'react-bootstrap';
import ProductItem from '../ProductItem';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsProps {
  onLogout: () => void;
}

const Products: React.FC<ProductsProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ products: Product[] }>('https://dummyjson.com/products');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const delayedFilter = _.debounce((cat: string, term: string) => {
    let filtered = products;

    if (cat) {
      filtered = filtered.filter(product => product.category.includes(cat));
    }

    if (term) {
      filtered = filtered.filter(product => product.title.toLowerCase().includes(term.toLowerCase()));
    }

    setFilteredProducts(filtered);
  }, 300);

  const handleCategoryChange = (category: string) => {
    setCategory(category);
    setCurrentPage(1);
    delayedFilter(category, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); 
    delayedFilter(category, term);
  };

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const pageNumbers = Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!localStorage.getItem('isLoggedIn')) {
    return <div>Please login to view products.</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6}>
          <Form.Group>
            <Form.Control type="text" placeholder="Search products" value={searchTerm} onChange={handleSearchChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="category-dropdown">
              Category
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleCategoryChange('')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('smartphones')}>Smartphones</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('fragrances')}>Fragrances</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('laptops')}>Laptops</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('skincare')}>Skincare</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('groceries')}>Groceries</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('home-decoration')}>Home decoration</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mt-3">
        {currentProducts.length === 0 ? (
          <Col>
            <p>No products found.</p>
          </Col>
        ) : (
          currentProducts.map(product => (
            <Col key={product.id} md={4} className="mb-4">
              <ProductItem product={product} />
            </Col>
          ))
        )}
      </Row>
      {currentProducts.length > 0 && (
        <Row className="mt-3">
          <Col>
            <Pagination>
              {pageNumbers.map(number => (
                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Products;
