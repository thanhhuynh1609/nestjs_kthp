import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductManage from './components/ProductManage';
import OrderList from './components/OrderList';
import OrderCreate from './components/OrderCreate';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products/manage" element={<ProductManage />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/create" element={<OrderCreate />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;