import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProductManage = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
      }
    };
    fetchProducts();
  }, [token]);

  const handleOpen = (product = null) => {
    if (product) {
      setForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
      });
      setEditId(product._id);
    } else {
      setForm({ title: '', description: '', price: '', image: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:8080/api/product/${editId}`,
          { ...form, price: parseFloat(form.price) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post(
          'http://localhost:8080/api/product',
          { ...form, price: parseFloat(form.price) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      const response = await axios.get('http://localhost:8080/api/product/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      handleClose();
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" align="center">
          Quản lý sản phẩm
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Thêm sản phẩm
        </Button>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image || 'https://via.placeholder.com/140'}
                  alt={product.title}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography color="textSecondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpen(product)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Xóa
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Tên"
              fullWidth
              margin="normal"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Thông tin"
              fullWidth
              margin="normal"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Giá"
              type="number"
              fullWidth
              margin="normal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextField
              label="Link ảnh"
              fullWidth
              margin="normal"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={handleSubmit} variant="contained">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductManage;