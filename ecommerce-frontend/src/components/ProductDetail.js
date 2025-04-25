import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Grid, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleQuantityChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 1);
    setQuantity(value);
  };

  const totalPrice = product ? product.price * quantity : 0;

  const handleAddToCart = () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmAdd = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/order',
        {
          products: [{
            product: product._id,
            quantity: quantity
          }]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOpenDialog(false);
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setError('Không thể thêm sản phẩm vào đơn hàng');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Không thể tải sản phẩm');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Typography align="center">Đang tải...</Typography>;

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Card elevation={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {/* Bên trái: Hình ảnh sản phẩm */}
            <Grid item xs={12} md={5} container justifyContent="center">
              <CardMedia
                component="img"
                height="300"
                image={product.image || 'https://via.placeholder.com/300'}
                alt={product.title}
                sx={{
                  objectFit: 'contain',
                  borderRadius: 2,  // Thêm bo góc cho ảnh
                  boxShadow: 3,  // Thêm bóng đổ nhẹ
                }}
              />
            </Grid>

            {/* Bên phải: Thông tin sản phẩm */}
            <Grid item xs={12} md={7}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {product.title}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${product.price}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Người bán: {product.owner?.username || 'Chưa có thông tin'}
                </Typography>

                {user && token ? (
                  // Chỉ hiển thị phần chọn số lượng và thêm vào giỏ khi đã đăng nhập
                  <Stack spacing={2} mt={3}>
                    <TextField
                      type="number"
                      label="Số lượng"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1 }}
                      fullWidth
                    />
                    
                    <Typography variant="h6" color="primary">
                      Tổng tiền: ${totalPrice}
                    </Typography>

                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Stack>
                ) : (
                  // Hiển thị nút đăng nhập nếu chưa đăng nhập
                  <Stack spacing={2} mt={3}>
                    <Typography variant="body1" color="text.secondary" align="center">
                      Vui lòng đăng nhập để mua hàng
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/login"
                    >
                      Đăng nhập
                    </Button>
                  </Stack>
                )}

                {/* Dialog xác nhận thêm vào giỏ hàng */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                  <DialogTitle>Xác nhận thêm vào giỏ hàng</DialogTitle>
                  <DialogContent>
                    <Typography variant="body1" gutterBottom>
                      Sản phẩm: {product.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Số lượng: {quantity}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Đơn giá: ${product.price}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      Tổng tiền: ${totalPrice}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleConfirmAdd} variant="contained">
                      Xác nhận
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Thông báo thành công */}
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={2000}
                  onClose={() => setOpenSnackbar(false)}
                  message="Đã thêm sản phẩm vào đơn hàng"
                />

                {error && (
                  <Typography color="error" align="center" mt={2}>
                    {error}
                  </Typography>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <Typography color="error" align="center" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetail;
