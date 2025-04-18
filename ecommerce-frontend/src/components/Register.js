import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Paper
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [seller, setSeller] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password,
        seller,
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} display="flex" justifyContent="center">
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, width: '100%' }}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            Đăng ký
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={seller}
                  onChange={(e) => setSeller(e.target.checked)}
                />
              }
              label="Đăng ký với tư cách người bán"
              sx={{ mt: 1 }}
            />

            {error && (
              <Typography color="error" align="center" mt={2}>
                {error}
              </Typography>
            )}

            <Box mt={3}>
              <Button type="submit" variant="contained" fullWidth size="large">
                Đăng ký
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
