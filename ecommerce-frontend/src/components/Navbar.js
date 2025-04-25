import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  TextField,
  Box,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import AppRegistration from '@mui/icons-material/AppRegistration';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?name=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              marginRight: 2
            }}
          >
            E-Commerce
          </Typography>

          <Tooltip title="Trang chủ">
            <IconButton color="inherit" component={Link} to="/">
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          flex: 1,
          justifyContent: 'center',
          maxWidth: 500
        }}>
          <TextField
            size="small"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            InputProps={{
              sx: { 
                bgcolor: 'background.paper',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                }
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ cursor: 'pointer', color: 'text.secondary' }}
                    onClick={handleSearch}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {user.admin && (
                <Tooltip title="Quản trị">
                  <IconButton color="inherit" component={Link} to="/admin">
                    <AdminPanelSettingsIcon />
                  </IconButton>
                </Tooltip>
              )}

              {user.seller && (
                <>
                  <Tooltip title="Quản lý sản phẩm">
                    <IconButton color="inherit" component={Link} to="/products/manage">
                      <InventoryIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Đơn đặt hàng">
                    <IconButton color="inherit" component={Link} to="/seller-orders">
                      <ShoppingBasketIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              <Tooltip title="Tài khoản">
                <IconButton onClick={handleOpenMenu} color="inherit">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.username?.charAt(0).toUpperCase() || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleCloseMenu} component={Link} to="/profile">
                  <AccountCircle sx={{ mr: 1 }} />
                  Hồ sơ
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} component={Link} to="/orders">
                  <ShoppingBasketIcon sx={{ mr: 1 }} />
                  Đơn hàng
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
              <Tooltip title="Đăng ký">
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
