// components/AdminUsers.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Quản lý Người dùng
        </Typography>
        
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Người bán</TableCell>
                <TableCell>Quản trị</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.seller ? 'Có' : 'Không'}</TableCell>
                  <TableCell>{user.admin ? 'Có' : 'Không'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AdminUsers;