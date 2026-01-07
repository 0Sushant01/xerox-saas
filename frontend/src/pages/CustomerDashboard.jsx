import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ color: 'var(--primary-color)' }}>My Dashboard</h2>
                <p>Welcome to your customer portal. Here you can upload documents and track your orders.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                        <h3>Find Shops</h3>
                        <p>Browse local print shops near you.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/shops')}>Browse Shops</button>
                    </div>
                    <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                        <h3>My Orders</h3>
                        <p>Track the status of your print jobs.</p>
                        <button className="btn btn-outline" onClick={() => navigate('/customer/orders')}>View Orders</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
