import { useEffect, useState } from 'react';
import { shopService } from '../services/api';
import { Link } from 'react-router-dom';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await shopService.getAllShops();
                setShops(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    if (loading) return <div className="container">Loading shops...</div>;

    return (
        <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>Available Xerox Shops</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {shops.length === 0 ? <p>No shops found.</p> : shops.map(shop => (
                    <div key={shop.id} className="card">
                        <h3>{shop.shop_name}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>{shop.location}</p>
                        <p style={{ marginTop: '0.5rem' }}>
                            Status: <span style={{ color: shop.is_open ? 'green' : 'red' }}>
                                {shop.is_open ? 'Open' : 'Closed'}
                            </span>
                        </p>
                        <Link to={`/shops/${shop.id}`} className="btn btn-outline" style={{ marginTop: '1rem', width: '100%', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                            View & Order
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopList;
