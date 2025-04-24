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
  Avatar,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/order/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
        setError('');
      } catch (err) {
        if (err.response?.status === 404) {
          setError('API không tồn tại, vui lòng kiểm tra server backend');
        } else if (err.response?.status === 403) {
          setError('Bạn không có quyền truy cập (yêu cầu quyền admin)');
        } else if (err.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        } else {
          setError('Không thể tải danh sách đơn hàng: ' + (err.message || 'Lỗi không xác định'));
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError('Vui lòng đăng nhập để xem đơn hàng');
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/order/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      setError('Xóa đơn hàng thất bại: ' + (err.message || 'Lỗi không xác định'));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box mt={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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

        {orders.length === 0 && !error && (
          <Typography align="center" mb={2}>
            Không có đơn hàng nào để hiển thị
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
                  <Typography variant="body2" color="text.secondary">
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
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Sản phẩm:
                    </Typography>
                    <Stack spacing={0.5} mt={1}>
                      {order.products.map((p) =>
                        p.product ? (
                          <Chip
                            key={p.product._id}
                            avatar={<Avatar src={p.product.imageUrl} />}
                            label={`${p.product.title} (SL: ${p.quantity})`}
                            variant="outlined"
                          />
                        ) : null,
                      )}
                    </Stack>
                  </Box>
                </CardContent>

                <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
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