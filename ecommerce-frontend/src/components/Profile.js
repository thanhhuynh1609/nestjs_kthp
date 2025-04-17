import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    seller: false,
    address: {
      addr1: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    },
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          username: response.data.username,
          seller: response.data.seller,
          address: response.data.address || {
            addr1: '',
            city: '',
            state: '',
            country: '',
            zip: '',
          },
        });
      } catch (err) {
        setError('Failed to load user data');
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (password) {
        updateData.password = password;
      }

      await axios.put('http://localhost:8080/api/user', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully');
      setPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Thông tin cá nhân
        </Typography>
        
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        
        {success && (
          <Typography color="primary" align="center">
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                name="seller"
                checked={formData.seller}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Tôi là người bán"
          />
          
          
          
          <Typography variant="h6" mt={2} mb={1}>
            Thay đổi mật khẩu
          </Typography>
          
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Cập nhật
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;