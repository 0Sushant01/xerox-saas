import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderService.list();
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast.error("Could not load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await orderService.updateStatus(id, newStatus);
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            toast.success(`Order marked as ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    // Calculate Summary Metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;

    return (
        <div className="container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Shop Manager</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back to your business dashboard.</p>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        navigate('/login');
                    }}
                    className="btn btn-outline"
                    style={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                    Logout
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{totalOrders}</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#f59e0b' }}>{pendingOrders}</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#10b981' }}>{completedOrders}</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shop Status</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#10b981' }}>OPEN</p>
                </div>
            </div>

            {/* Actions & Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                {/* Main Content: Orders Table */}
                <div>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Recent Orders</h3>
                            <button className="btn btn-outline" onClick={() => navigate('/shop-admin')}>View All</button>
                        </div>

                        {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders received yet.</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ORDER ID</th>
                                        <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>DETAILS</th>
                                        <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>STATUS</th>
                                        <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.75rem', fontWeight: '500' }}>#{order.id.substring(0, 8)}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {order.copies}x {order.print_type} <br />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doc: {order.document ? order.document.substring(0, 10) + '...' : 'None'}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: order.status === 'completed' ? '#dcfce7' :
                                                        order.status === 'pending' ? '#fef3c7' : '#e0f2fe',
                                                    color: order.status === 'completed' ? '#166534' :
                                                        order.status === 'pending' ? '#92400e' : '#075985'
                                                }}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    style={{ padding: '0.25rem', fontSize: '0.85rem', marginBottom: 0 }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="printing">Printing</option>
                                                    <option value="ready">Ready</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Sidebar: Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h3>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/manage-shop')}>Edit Shop Profile</button>
                            <button className="btn btn-outline" onClick={() => navigate('/owner/pricing')}>Manage Pricing</button>
                            <button className="btn btn-outline" disabled>View Analytics (Pro)</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
