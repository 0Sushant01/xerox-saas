import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('access_token');

    let dashboardPath = '/dashboard';
    let userRole = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
            if (userRole === 'customer') {
                dashboardPath = '/customer';
            } else if (userRole === 'shop_owner') {
                dashboardPath = '/owner/dashboard';
            }
        } catch (e) {
            console.error("Failed to decode token", e);
        }
    }

    const isOnDashboard = location.pathname === dashboardPath;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        toast.info('Logged out');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-brand">Xerox SaaS</Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {token ? (
                        <>
                            {!isOnDashboard && (
                                <Link to={dashboardPath} className="btn btn-outline" style={{ border: 'none' }}>Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
