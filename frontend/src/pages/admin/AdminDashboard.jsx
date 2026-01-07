import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        shops: { total: 0, active: 0, inactive: 0 },
        users: { total: 0, shop_owners: 0, customers: 0 }
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await adminService.getStats();
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch stats", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem', color: '#111827' }}>Admin Dashboard</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Shops Card */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', margin: 0 }}>Shops</h3>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem' }}>Overview</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.shops.total}</p>
                        <div style={{ fontSize: '0.875rem' }}>
                            <div style={{ color: '#166534' }}>● {stats.shops.active} Active</div>
                            <div style={{ color: '#991b1b' }}>● {stats.shops.inactive} Inactive</div>
                        </div>
                    </div>
                </div>

                {/* Users Card */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', margin: 0 }}>Users</h3>
                        <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem' }}>Overview</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.users.total}</p>
                        <div style={{ fontSize: '0.875rem' }}>
                            <div style={{ color: '#000' }}>● {stats.users.shop_owners} Owners</div>
                            <div style={{ color: '#666' }}>● {stats.users.customers} Customers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#111827', marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/admin-panel/shops/new')}>
                        + Add New Shop
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/admin-panel/shops')}>
                        View All Shops
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/admin-panel/users')}>
                        View Users
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
