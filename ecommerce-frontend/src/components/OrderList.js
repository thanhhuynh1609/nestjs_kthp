import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Divider,
  Grid,
  Avatar,
  Chip, // Thêm Chip để hiển thị trạng thái
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/order', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng');
      }
    };
    fetchOrders();
  }, [token]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const handleDeleteOrder = (orderId) => {
    // Call API to delete the order here
    console.log(`Delete order with ID: ${orderId}`);
  };

  const handleViewOrder = (orderId) => {
    // Navigate to order detail page or open modal
    console.log(`View order with ID: ${orderId}`);
  };

  return (
    <Container maxWidth="md">
      <Box mt={6}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Đơn hàng của tôi
        </Typography>

        <Stack direction="row" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            component={Link}
            to="/orders/create"
          >
            Tạo đơn hàng mới
          </Button>
        </Stack>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Stack spacing={3}>
          {orders.map((order) => (
            <Paper key={order._id} elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tổng tiền: ${order.totalPrice}
              </Typography>

              {/* Thêm hiển thị trạng thái */}
              <Typography variant="body2" color="text.secondary" mb={1}>
                Trạng thái:{' '}
                <Chip
                  label={order.trangThai}
                  color={
                    order.trangThai === 'Đã giao'
                      ? 'success'
                      : order.trangThai === 'Đã hủy'
                      ? 'error'
                      : order.trangThai === 'Đang giao hàng'
                      ? 'warning'
                      : 'default'
                  }
                />
              </Typography>

              <Typography variant="subtitle1" fontWeight="medium">
                Danh sách sản phẩm:
              </Typography>

              <Box ml={2} mb={1}>
                {order.products.map((p) => (
                  <Grid container spacing={2} key={p.product._id} alignItems="center">
                    {/* Ảnh sản phẩm và thông tin bên trái */}
                    <Grid item xs={8} container alignItems="center">
                      <Grid item xs={3}>
                        <Avatar 
                          variant="square" 
                          src={p.product.imageUrl} 
                          sx={{ width: 80, height: 80, objectFit: 'cover' }} 
                        />
                      </Grid>
                      <Grid item xs={9}>
                        <Typography>
                          <strong>{p.product.title}</strong>
                        </Typography>
                        <Typography>Số lượng: {p.quantity}</Typography>
                      </Grid>
                    </Grid>

                    {/* Nút Xem và Xóa nằm sát phải */}
                    <Grid item xs={4} container justifyContent="flex-end">
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewOrder(order._id)}
                          sx={{ width: '48%' }}
                        >
                          Xem
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteOrder(order._id)}
                          sx={{ width: '48%' }}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                ))}
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography variant="body2" color="text.secondary">
                Ngày mua: {formatDate(order.created)}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default OrderList;