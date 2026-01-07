import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import PricingManagement from './pages/PricingManagement';
import RegisterShop from './pages/RegisterShop';
import ShopList from './pages/ShopList';
import ShopDetails from './pages/ShopDetails';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import ShopManagement from './pages/ShopManagement';
import CustomerOrders from './pages/CustomerOrders';

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShops from './pages/admin/AdminShops';
import AdminUsers from './pages/admin/AdminUsers';

const HomeRedirect = () => {
  const token = localStorage.getItem('access_token');
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<PrivateRoute roleRequired="customer"><CustomerDashboard /></PrivateRoute>} />
        <Route path="/customer/orders" element={<PrivateRoute roleRequired="customer"><CustomerOrders /></PrivateRoute>} />
        <Route path="/shops" element={<PrivateRoute roleRequired="customer"><ShopList /></PrivateRoute>} />
        <Route path="/shops/:id" element={<PrivateRoute roleRequired="customer"><ShopDetails /></PrivateRoute>} />

        {/* Shop Owner Routes */}
        {/* Redirect /dashboard to /owner/dashboard or just keep using /dashboard but protect it */}
        {/* Requirement says: /owner/dashboard */}
        <Route path="/owner/dashboard" element={<PrivateRoute roleRequired="shop_owner"><OwnerDashboard /></PrivateRoute>} />
        <Route path="/owner/register-shop" element={<PrivateRoute roleRequired="shop_owner"><RegisterShop /></PrivateRoute>} />
        <Route path="/owner/pricing" element={<PrivateRoute roleRequired="shop_owner"><PricingManagement /></PrivateRoute>} />

        {/* Keep legacy /dashboard for now as alias or redirect? Let's just create a redirect or duplicate for safety if user types it manually */}
        <Route path="/dashboard" element={<Navigate to="/owner/dashboard" replace />} />

        <Route path="/shop-admin" element={<PrivateRoute roleRequired="shop_owner"><ShopOwnerDashboard /></PrivateRoute>} />
        <Route path="/manage-shop" element={<PrivateRoute roleRequired="shop_owner"><ShopManagement /></PrivateRoute>} />

        {/* Admin Panel Routes */}
        <Route path="/admin-panel/login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<PrivateRoute roleRequired="admin"><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="shops/new" element={<RegisterShop isAdmin={true} />} /> {/* Reusing RegisterShop? or need new? */}
        </Route>

        {/* Redirect Root based on auth */}
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
