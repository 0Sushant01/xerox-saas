import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        toast.info("Admin Session Ended");
        navigate('/admin-panel/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#1f2937', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '1px solid #374151' }}>
                    Xerox Admin
                </div>
                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <Link to="/admin-panel" style={{ display: 'block', padding: '0.75rem', color: '#e5e7eb', textDecoration: 'none', borderRadius: '0.375rem' }} className="admin-link">
                                Dashboard
                            </Link>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <Link to="/admin-panel/shops" style={{ display: 'block', padding: '0.75rem', color: '#e5e7eb', textDecoration: 'none', borderRadius: '0.375rem' }} className="admin-link">
                                Shops
                            </Link>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <Link to="/admin-panel/users" style={{ display: 'block', padding: '0.75rem', color: '#e5e7eb', textDecoration: 'none', borderRadius: '0.375rem' }} className="admin-link">
                                Users
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
                    <button
                        onClick={handleLogout}
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid #4b5563', color: 'white', borderRadius: '0.375rem', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: '#f9fafb', padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
