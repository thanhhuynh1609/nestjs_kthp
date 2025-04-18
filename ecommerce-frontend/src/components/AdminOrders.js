import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng');
      }
    };
    fetchOrders();
  }, [token]);

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      setError('Xóa đơn hàng thất bại');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Quản lý Đơn hàng
        </Typography>

        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}

        <Grid container spacing={4}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tổng tiền: <strong>${order.totalPrice}</strong>
                  </Typography>
                  <Typography variant="body1">
                    Người mua: {order.owner?.username || 'Ẩn danh'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ngày mua: {new Date(order.created).toLocaleDateString()}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Sản phẩm:
                    </Typography>
                    <Stack spacing={0.5} mt={1}>
                      {order.products.map((p) => (
                        <Chip
                          key={p.product._id}
                          label={`${p.product.title} (SL: ${p.quantity})`}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(order._id)}
                  >
                    Xóa
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminOrders;
