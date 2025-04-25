import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';
import ProductCard from './ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('name');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/search?title=${encodeURIComponent(searchTerm)}`
        );
        setResults(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kết quả tìm kiếm cho: "{searchTerm}"
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && results.length === 0 && (
        <Alert severity="info">
          Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchTerm}"
        </Alert>
      )}

      {!loading && !error && results.length > 0 && (
        <Grid container spacing={3}>
          {results.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
