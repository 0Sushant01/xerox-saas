import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ShopList from './pages/ShopList';
import ShopDetails from './pages/ShopDetails';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import ShopManagement from './pages/ShopManagement';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/shops" element={<PrivateRoute><ShopList /></PrivateRoute>} />
        <Route path="/shops/:id" element={<PrivateRoute><ShopDetails /></PrivateRoute>} />
        <Route path="/shop-admin" element={<PrivateRoute><ShopOwnerDashboard /></PrivateRoute>} />
        <Route path="/manage-shop" element={<PrivateRoute><ShopManagement /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
