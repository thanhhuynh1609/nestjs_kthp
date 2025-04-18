import React, { useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cardItems = [
    {
      title: 'Quản lý Người dùng',
      icon: <PeopleIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      link: '/admin/users',
    },
    {
      title: 'Quản lý Sản phẩm',
      icon: <InventoryIcon sx={{ fontSize: 50, color: 'success.main' }} />,
      link: '/admin/products',
    },
    {
      title: 'Quản lý Đơn hàng',
      icon: <ShoppingCartIcon sx={{ fontSize: 50, color: 'warning.main' }} />,
      link: '/admin/orders',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Trang Quản Trị
        </Typography>

        <Typography variant="h5" align="center" mb={4} color="text.secondary">
          Xin chào, {user?.username}
        </Typography>

        <Grid container spacing={4}>
          {cardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6, transform: 'scale(1.03)' }
                }}
              >
                <CardContent>
                  <Box mb={2}>{item.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">
                    {item.title}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(item.link)}
                  >
                    Truy cập
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={5} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
