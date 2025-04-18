// components/Login.js
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });
      
      console.log('RAW API RESPONSE:', response.data); // Thêm dòng này để debug
      
      // Đảm bảo cấu trúc user object
      const userData = {
        _id: response.data.user._id,
        username: response.data.user.username,
        seller: response.data.user.seller || false,
        admin: response.data.user.admin, // Thêm dòng này
        created: response.data.user.created
      };
      
      console.log('PROCESSED USER DATA:', userData); // Debug
      
      login(userData, response.data.token);
      
      if (userData.admin) {
        console.log('REDIRECTING TO ADMIN');
        navigate('/admin', { replace: true }); // Thêm replace: true
      } else {
        console.log('REDIRECTING TO HOME');
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('LOGIN ERROR DETAILS:', err.response);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">
          Đăng nhập
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Mật Khẩu"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Đăng nhập
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;