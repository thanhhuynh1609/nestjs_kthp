import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
        const response = await axios.get('http://localhost:8080/api/product');
        setProducts(response.data);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm');
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
        'http://localhost:8080/api/order',
        { products: selectedProducts },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate('/orders');
    } catch (err) {
      setError('Tạo đơn hàng thất bại');
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={8} display="flex" justifyContent="center">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            Tạo đơn hàng
          </Typography>

          <form onSubmit={handleSubmit}>
            {selectedProducts.map((item, index) => (
              <Box
                key={index}
                mb={3}
                p={2}
                border="1px solid #ddd"
                borderRadius={2}
              >
                <TextField
                  select
                  label="Sản phẩm"
                  fullWidth
                  value={item.product}
                  onChange={(e) =>
                    handleProductChange(index, 'product', e.target.value)
                  }
                >
                  {products.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.title}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Số lượng"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={item.quantity}
                  onChange={(e) =>
                    handleProductChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </Box>
            ))}

            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
              >
                Thêm đơn mua khác
              </Button>
            </Box>

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            <Box mt={2}>
              <Button type="submit" variant="contained" fullWidth size="large">
                Tạo đơn
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderCreate;
