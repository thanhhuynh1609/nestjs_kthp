// components/Navbar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TNBH_Store
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Sản Phẩm
        </Button>
        {user ? (
          <>
            {user.admin && (
              <Button color="inherit" component={Link} to="/admin">
                Quản trị
              </Button>
            )}
            {user.seller && (
              <>
                <Button color="inherit" component={Link} to="/products/manage">
                  Quản lý SP
                </Button>
                <Button color="inherit" component={Link} to="/seller-orders">
                  Đơn đặt hàng
                </Button>
              </>
            )}
            <Button color="inherit" component={Link} to="/profile">
              Hồ sơ
            </Button>
            <Button color="inherit" component={Link} to="/orders">
              Mua hàng
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Đăng nhập
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Đăng kí
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;