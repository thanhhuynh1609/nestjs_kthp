import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  Avatar,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../services/api';

const AdminBanners = () => {
  // Xóa biến token không cần thiết
  useContext(AuthContext); // Giữ useContext để tránh lỗi React Hook rules

  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    image: '',
    link: '',
    isActive: true,
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        setBanners(response);
      } catch (err) {
        setError('Không thể tải banner');
      }
    };
    fetchBanners();
  }, []);

  const handleOpen = (banner = null) => {
    if (banner) {
      setForm({
        title: banner.title,
        image: banner.image,
        link: banner.link || '',
        isActive: banner.isActive,
      });
      setEditId(banner._id);
    } else {
      setForm({ title: '', image: '', link: '', isActive: true });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await updateBanner(editId, form);
      } else {
        await createBanner(form);
      }
      const response = await getBanners();
      setBanners(response);
      handleClose();
    } catch (err) {
      setError('Không thể lưu banner');
    }
  };

  const handleDelete = async id => {
    try {
      await deleteBanner(id);
      setBanners(banners.filter(banner => banner._id !== id));
    } catch (err) {
      setError('Xóa banner thất bại');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await updateBanner(id, { isActive: !isActive });
      setBanners(
        banners.map(banner =>
          banner._id === id ? { ...banner, isActive: !isActive } : banner,
        ),
      );
    } catch (err) {
      setError('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Quản lý Banner
        </Typography>
        <Box display="flex" justifyContent="center" mb={3}>
          <Button variant="contained" onClick={() => handleOpen()}>
            Thêm Banner
          </Button>
        </Box>

        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Link</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map(banner => (
                <TableRow key={banner._id} hover>
                  <TableCell>
                    <Avatar
                      src={banner.image || 'https://via.placeholder.com/40'}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>{banner.link || 'Không có'}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={banner.isActive}
                      onChange={() =>
                        handleToggleActive(banner._id, banner.isActive)
                      }
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(banner)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(banner._id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog thêm/sửa banner */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Sửa Banner' : 'Thêm Banner'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Tiêu đề"
              fullWidth
              margin="normal"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Link ảnh"
              fullWidth
              margin="normal"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
            />
            <TextField
              label="Link liên kết (nếu có)"
              fullWidth
              margin="normal"
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
            />
            <Box display="flex" alignItems="center">
              <Switch
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                color="primary"
              />
              <Typography>Kích hoạt</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={handleSubmit} variant="contained">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminBanners;
