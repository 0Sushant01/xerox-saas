import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopService, adminService } from '../services/api';
import { toast } from 'react-toastify';

const RegisterShop = ({ isAdmin = false }) => {
    const [shopData, setShopData] = useState({
        shop_name: '',
        location: '',
        is_open: true,
        owner: '' // For admin use
    });
    const [owners, setOwners] = useState([]); // List of potential owners
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin) {
            fetchOwners();
        }
    }, [isAdmin]);

    const fetchOwners = async () => {
        try {
            const res = await adminService.getUsers();
            // Filter only shop owners? Or allow any user to become one? 
            // Requirement: "View shop owners". Typically assign to 'shop_owner' role.
            // Let's filter for role='shop_owner'
            const shopOwners = res.data.filter(u => u.role === 'shop_owner');
            setOwners(shopOwners);
        } catch (err) {
            console.error("Failed to fetch owners", err);
            toast.error("Could not load users list");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...shopData };
            // If not admin, remove owner field (backend relies on request.user)
            if (!isAdmin) delete payload.owner;

            await shopService.createShop(payload);
            toast.success('Shop Created Successfully!');
            if (isAdmin) {
                navigate('/admin-panel/shops');
            } else {
                navigate('/owner/dashboard');
            }
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
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                    {isAdmin ? 'Add New Shop' : 'Setup Your Shop'}
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    {isAdmin ? 'Create a shop and assign an owner.' : 'Create your first shop profile to get started.'}
                </p>

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

                    {isAdmin && (
                        <div>
                            <label>Assign Owner</label>
                            <select
                                required
                                value={shopData.owner}
                                onChange={(e) => setShopData({ ...shopData, owner: e.target.value })}
                                disabled={isSubmitting}
                            >
                                <option value="">Select Shop Owner</option>
                                {owners.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.email} (ID: {user.id.substring(0, 6)})
                                    </option>
                                ))}
                            </select>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>Only users with 'Shop Owner' role are listed.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Shop...' : 'Create Shop'}
                    </button>

                    {!isAdmin && (
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button type="button" onClick={() => {
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                navigate('/login');
                            }} className="btn btn-outline" style={{ border: 'none', color: 'red' }}>Logout</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterShop;
