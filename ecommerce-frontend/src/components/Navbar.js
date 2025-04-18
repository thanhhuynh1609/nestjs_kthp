import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box
} from '@mui/material';
import {
  Home as HomeIcon,
  AdminPanelSettings as AdminIcon,
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
  AccountCircle,
  Login,
  AppRegistration,
  Logout
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', letterSpacing: 1.5 }}
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          TNBH_Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Sản phẩm">
            <IconButton color="inherit" component={Link} to="/">
              <HomeIcon />
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              {user.admin && (
                <Tooltip title="Quản trị">
                  <IconButton color="inherit" component={Link} to="/admin">
                    <AdminIcon />
                  </IconButton>
                </Tooltip>
              )}

              {user.seller && (
                <>
                  <Tooltip title="QL Sản phẩm">
                    <IconButton color="inherit" component={Link} to="/products/manage">
                      <ProductIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Đơn đặt hàng">
                    <IconButton color="inherit" component={Link} to="/seller-orders">
                      <OrderIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              <Tooltip title="Tài khoản">
                <IconButton onClick={handleOpenMenu} color="inherit">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.name?.charAt(0).toUpperCase() || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleCloseMenu} component={Link} to="/profile">
                  <AccountCircle sx={{ mr: 1 }} />
                  Hồ sơ
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} component={Link} to="/orders">
                  <OrderIcon sx={{ mr: 1 }} />
                  Mua hàng
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Tooltip title="Đăng nhập">
                <IconButton color="inherit" component={Link} to="/login">
                  <Login />
                </IconButton>
              </Tooltip>
              <Tooltip title="Đăng kí">
                <IconButton color="inherit" component={Link} to="/register">
                  <AppRegistration />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
