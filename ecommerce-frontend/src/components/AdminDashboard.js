// components/AdminDashboard.js
import React, { useContext } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h3" align="center" gutterBottom>
          Trang Quản Trị
        </Typography>
        
        <Typography variant="h5" align="center" mb={4}>
          Xin chào, {user?.username}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Quản lý Người dùng
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/admin/users')}
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Quản lý Sản phẩm
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/admin/products')}
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Quản lý Đơn hàng
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/admin/orders')}
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="center">
          <Button 
            variant="outlined" 
            color="error"
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