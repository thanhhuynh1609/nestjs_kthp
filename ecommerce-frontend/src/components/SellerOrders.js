import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SellerOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/order/seller-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Seller Orders Data:', response.data); // Debug dữ liệu
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load seller orders');
      }
    };
    fetchSellerOrders();
  }, [token]);

  return (
    <Container maxWidth="lg">
      <Box mt={5} mb={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Đơn đặt từ sản phẩm của Shop
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {orders.length === 0 ? (
          <Typography align="center" color="textSecondary">
            Không tìm thấythấy
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order._id}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    {/* Thông tin đơn hàng */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        Đặt bởi: {order.owner.username}
                      </Typography>
                      <Chip
                        label={`Tổng tiền: $${order.totalPrice}`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {/* Danh sách sản phẩm */}
                    <Typography variant="subtitle1" color="textSecondary" mb={1}>
                      Sản Phẩm:
                    </Typography>
                    <Grid container spacing={2}>
                      {order.products.map((p) => (
                        <Grid item xs={12} sm={6} md={4} key={p.product._id}>
                          <Card elevation={1} sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                            {/* Hình ảnh sản phẩm */}
                            <CardMedia
                              component="img"
                              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                              image={p.product.image || 'https://via.placeholder.com/80'}
                              alt={p.product.title}
                            />
                            {/* Thông tin sản phẩm */}
                            <Box sx={{ ml: 2, flex: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {p.product.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Số lượng: {p.quantity}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Giá: ${p.product.price}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Tổng: ${(p.product.price * p.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Thời gian tạo đơn hàng */}
                    <Typography variant="body2" color="textSecondary" mt={2}>
                      Ngày đặt: {new Date(order.created).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default SellerOrders;