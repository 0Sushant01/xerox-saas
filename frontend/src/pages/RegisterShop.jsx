import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopService } from '../services/api';
import { toast } from 'react-toastify';

const RegisterShop = () => {
    const [shopData, setShopData] = useState({
        shop_name: '',
        location: '',
        is_open: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await shopService.createShop(shopData);
            toast.success('Shop Created Successfully!');
            navigate('/owner/dashboard'); // Redirect to dashboard after creation
        } catch (err) {
            console.error("Shop Creation Error", err);
            toast.error('Failed to create shop.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Setup Your Shop</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create your first shop profile to get started.</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Shop Name</label>
                        <input
                            type="text"
                            required
                            value={shopData.shop_name}
                            onChange={(e) => setShopData({ ...shopData, shop_name: e.target.value })}
                            disabled={isSubmitting}
                            placeholder="e.g. Campus Xerox"
                        />
                    </div>
                    <div>
                        <label>Location</label>
                        <input
                            type="text"
                            required
                            value={shopData.location}
                            onChange={(e) => setShopData({ ...shopData, location: e.target.value })}
                            disabled={isSubmitting}
                            placeholder="e.g. Near Library Gate"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Shop...' : 'Create Shop'}
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button type="button" onClick={() => {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            navigate('/login');
                        }} className="btn btn-outline" style={{ border: 'none', color: 'red' }}>Logout</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterShop;
