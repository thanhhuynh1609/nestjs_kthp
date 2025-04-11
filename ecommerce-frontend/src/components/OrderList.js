import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material'; // Thêm Button
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
        setError('Failed to load orders');
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" align="center">
          Đơn đặt hàng của tôi
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/orders/create"
          sx={{ mb: 2 }}
        >
          Mua hàng
        </Button>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <List>
          {orders.map((order) => (
            <ListItem key={order._id} divider>
              <ListItemText
                primary={`Tổng tiền: $${order.totalPrice}`}
                secondary={
                  <>
                    <Typography>
                      Sản phẩm:
                      {order.products.map((p) => (
                        <div key={p.product._id}>
                          {p.product.title} (SL: {p.quantity})
                        </div>
                      ))}
                    </Typography>
                    <Typography>Ngày mua: {new Date(order.created).toLocaleDateString()}</Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default OrderList;