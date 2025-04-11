import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={product.image || 'https://via.placeholder.com/300'}
            alt={product.title}
          />
          <CardContent>
            <Typography variant="h4">{product.title}</Typography>
            <Typography color="textSecondary">{product.description}</Typography>
            <Typography variant="h5" color="primary">
              ${product.price}
            </Typography>
            <Typography color="textSecondary">
              Người bán: {product.owner?.username || 'Unknown'}
            </Typography>
            <Box mt={2}>
              <Button variant="contained" fullWidth>
                Thêm vào giỏ hàng
              </Button>
            </Box>
          </CardContent>
        </Card>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetail;