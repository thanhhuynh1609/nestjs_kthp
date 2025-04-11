import React from 'react';
import ReactDOM from 'react-dom/client'; // Thay đổi import
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root')); // Sử dụng createRoot
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);