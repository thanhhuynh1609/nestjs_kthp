import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getBanners } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, bannersResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/product'),
          getBanners(),
        ]);

        console.log('Products:', productsResponse.data);
        console.log('Banners Response:', bannersResponse);

        if (Array.isArray(bannersResponse)) {
          setBanners(bannersResponse.filter(banner => banner.isActive));
        } else {
          console.error('Banners response is not an array:', bannersResponse);
          setBanners([]);
        }

        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu');
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        {/* Hiển thị banner carousel */}
        {banners.length > 0 ? (
          <Box mb={4}>
            <Carousel autoPlay infiniteLoop showThumbs={false}>
              {banners.map(banner => (
                <div key={banner._id}>
                  {banner.link ? (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={banner.image}
                        alt={banner.title}
                        style={{
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <p className="legend">{banner.title}</p>
                    </a>
                  ) : (
                    <>
                      <img
                        src={banner.image}
                        alt={banner.title}
                        style={{
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <p className="legend">{banner.title}</p>
                    </>
                  )}
                </div>
              ))}
            </Carousel>
          </Box>
        ) : (
          <Typography align="center" mb={4}>
            Không có banner để hiển thị
          </Typography>
        )}

        <Typography variant="h4" align="center" fontWeight="bold">
          Sản phẩm
        </Typography>
        {error && (
          <Typography color="error" align="center" mt={2}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3} mt={2}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                sx={{
                  width: '250px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '400px',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 0,
                    paddingTop: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" mt={1}>
                      ${product.price}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/product/${product._id}`}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductList;
