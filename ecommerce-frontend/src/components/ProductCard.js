import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 300, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          💰 {product.price?.toLocaleString()} VNĐ
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={Link}
          to={`/product/${product._id}`}
          variant="contained"
          color="primary"
          fullWidth
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
