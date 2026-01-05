import { useEffect, useState } from 'react';
import { orderService } from '../services/api'; // Assume we will add a method to fetch shop specific orders or filter in component
import { toast } from 'react-toastify';

const ShopOwnerDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // In our backend OrderViewSet, we implemented logic: if user is shop_owner, return orders for their shop.
        // So generic list() works.
        const fetchOrders = async () => {
            try {
                const res = await orderService.list();
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await orderService.updateStatus(id, newStatus);
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            toast.success("Order Updated");
        } catch (err) {
            toast.error("Update Failed");
        }
    };

    return (
        <div className="container">
            <h2>Shop Manager - Incoming Orders</h2>
            <div style={{ marginTop: '1rem' }}>
                {orders.length === 0 ? <p>No orders yet.</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }} className="card">
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>ID</th>
                                <th style={{ padding: '1rem' }}>File</th>
                                <th style={{ padding: '1rem' }}>Config</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>{order.id.substring(0, 8)}...</td>
                                    <td style={{ padding: '1rem' }}>Doc #{order.document ? order.document.substring(0, 5) : 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {order.copies}x {order.print_type}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            fontSize: '0.8rem',
                                            backgroundColor: order.status === 'completed' ? '#dcfce7' : '#e0f2fe',
                                            color: order.status === 'completed' ? '#166534' : '#075985'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            style={{ margin: 0, padding: '0.25rem' }}
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
    );
};

export default ShopOwnerDashboard;
