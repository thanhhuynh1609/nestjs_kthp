import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
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

      const userData = {
        _id: response.data.user._id,
        username: response.data.user.username,
        seller: response.data.user.seller || false,
        admin: response.data.user.admin,
        created: response.data.user.created,
      };

      login(userData, response.data.token);

      if (userData.admin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} display="flex" justifyContent="center">
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, width: '100%' }}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
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
              label="Mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" align="center" mt={1}>
                {error}
              </Typography>
            )}

            <Box mt={3}>
              <Button type="submit" variant="contained" fullWidth size="large">
                Đăng nhập
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
