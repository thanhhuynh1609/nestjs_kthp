import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OrderCreate = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([{ product: '', quantity: 1 }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/product');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product: '', quantity: 1 }]);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...selectedProducts];
    newProducts[index][field] = value;
    setSelectedProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/order',
        { products: selectedProducts },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate('/orders');
    } catch (err) {
      setError('Failed to create order');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">
          Create Order
        </Typography>
        <form onSubmit={handleSubmit}>
          {selectedProducts.map((item, index) => (
            <Box key={index} mb={2}>
              <TextField
                select
                label="Product"
                fullWidth
                value={item.product}
                onChange={(e) => handleProductChange(index, 'product', e.target.value)}
              >
                {products.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(index, 'quantity', parseInt(e.target.value))
                }
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddProduct} sx={{ mb: 2 }}>
            Add Another Product
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Create Order
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default OrderCreate;