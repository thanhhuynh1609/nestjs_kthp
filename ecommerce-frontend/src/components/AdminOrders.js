import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
                <Typography variant="h4" align="center" gutterBottom>
                    Quản lý Đơn hàng
                </Typography>

                {error && (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                )}

                <List>
                    {orders.map((order) => (
                        <React.Fragment key={order._id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={`Tổng tiền: $${order.totalPrice}`}
                                    secondary={
                                        <>
                                            <Typography>
                                                Người mua: {order.owner?.username || 'Ẩn danh'}
                                            </Typography>
                                            <Typography>
                                                Ngày mua: {new Date(order.created).toLocaleDateString()}
                                            </Typography>
                                            <Typography>Sản phẩm:</Typography>
                                            {order.products.map((p) => (
                                                <Typography key={p.product._id} sx={{ pl: 2 }}>
                                                    - {p.product.title} (SL: {p.quantity})
                                                </Typography>
                                            ))}
                                        </>
                                    }
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(order._id)}
                                >
                                    Xóa
                                </Button>
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default AdminOrders;
