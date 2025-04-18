import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Grid, Stack } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

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

                {/* Các nút hành động */}
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="contained" fullWidth>
                    Thêm vào giỏ hàng
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Mua ngay
                  </Button>
                </Stack>
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
