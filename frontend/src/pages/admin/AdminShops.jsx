import { useEffect, useState } from 'react';
import { shopService } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const res = await shopService.getAllShops();
            setShops(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch shops");
        } finally {
            setLoading(false);
        }
    };

    const toggleShopStatus = async (shop) => {
        if (!window.confirm(`Are you sure you want to ${shop.is_active ? 'disable' : 'enable'} this shop?`)) return;

        try {
            // Using updateShop from api.js which calls PATCH /shops/{id}/
            await shopService.updateShop(shop.id, { is_active: !shop.is_active });
            toast.success("Shop status updated");
            fetchShops(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error("Failed to update shop status");
        }
    };

    if (loading) return <div>Loading Shops...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#111827', margin: 0 }}>Manage Shops</h2>
                <Link to="/admin-panel/shops/new" className="btn btn-primary">+ Add New Shop</Link>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Shop Name</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Owner</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Location</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Status</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No shops found.</td></tr>
                        ) : (
                            shops.map(shop => (
                                <tr key={shop.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: '#111827' }}>{shop.shop_name}</td>
                                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                                        {shop.owner_email || shop.owner}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#4b5563' }}>{shop.location}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            backgroundColor: shop.is_active ? '#dcfce7' : '#fee2e2',
                                            color: shop.is_active ? '#166534' : '#991b1b'
                                        }}>
                                            {shop.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                onClick={() => toggleShopStatus(shop)}
                                            >
                                                {shop.is_active ? 'Disable' : 'Enable'}
                                            </button>
                                            {/* Add Edit button routing later if needed */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminShops;
