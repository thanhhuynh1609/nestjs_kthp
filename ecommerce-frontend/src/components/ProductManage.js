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
        const response = await axios.get('http://localhost:3000/product/mine', {
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
          `http://localhost:3000/product/${editId}`,
          { ...form, price: parseFloat(form.price) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post(
          'http://localhost:3000/product',
          { ...form, price: parseFloat(form.price) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      const response = await axios.get('http://localhost:3000/product/mine', {
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
      await axios.delete(`http://localhost:3000/product/${id}`, {
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
          Manage Products
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add Product
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
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextField
              label="Image URL"
              fullWidth
              margin="normal"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductManage;