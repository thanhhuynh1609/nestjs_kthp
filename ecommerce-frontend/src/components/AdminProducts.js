import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminProducts = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError('Không thể tải sản phẩm');
      }
    };
    fetchProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setError('Xóa sản phẩm thất bại');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Quản lý Sản phẩm
        </Typography>

        {error && (
          <Typography color="error" align="center">{error}</Typography>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AdminProducts;
