import { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.list();
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
            // toast.error("Failed to load orders"); 
            // Often list endpoints might be empty or fail if no auth, but we assume auth wrapper
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading orders...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>My Orders</h2>

            {orders.length === 0 ? (
                <div className="card">
                    <p>No orders found. Go to shops to place an order.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Order #{order.id.substring(0, 8)}</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                                    Shop: <strong>{order.shop_name || 'Unknown Shop'}</strong> | Status: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{order.status}</span>
                                </p>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={item.id || idx} style={{ marginTop: '0.25rem' }}>
                                            - Doc: {item.document_name || item.document} | {item.copies}x {item.print_type}, {item.side}, {item.binding}
                                        </div>
                                    ))}
                                </div>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
                                    ₹{order.total_price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;
