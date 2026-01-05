import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { pricingService } from '../services/api';

const PricingManagement = () => {
    const [pricings, setPricings] = useState([]);
    const [formData, setFormData] = useState({
        print_type: 'color',
        side: 'single',
        price_per_page: '',
        binding_price: '0'
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPricing = async () => {
        try {
            const res = await pricingService.list();
            setPricings(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load pricing.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (parseFloat(formData.price_per_page) <= 0) {
            toast.error("Price must be greater than 0");
            setIsSubmitting(false);
            return;
        }

        try {
            await pricingService.create(formData);
            toast.success("Pricing Saved Successfully!");
            fetchPricing(); // Refresh list
            setFormData({ ...formData, price_per_page: '', binding_price: '0' }); // Reset price inputs but keep type selections for ease
        } catch (err) {
            console.error(err);
            toast.error("Failed to save pricing.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pricing rule?")) return;
        try {
            await pricingService.delete(id);
            toast.success("Pricing Removed");
            setPricings(pricings.filter(p => p.id !== id));
        } catch (err) {
            toast.error("Failed to delete.");
        }
    };

    const handleEdit = (pricing) => {
        setFormData({
            print_type: pricing.print_type,
            side: pricing.side,
            price_per_page: pricing.price_per_page,
            binding_price: pricing.binding_price
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Pricing Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Set your rates for different print types and sides.</p>

            {/* Pricing Form */}
            <div className="card" style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                <h3>Add / Update Pricing</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <label>Print Type</label>
                        <select
                            value={formData.print_type}
                            onChange={(e) => setFormData({ ...formData, print_type: e.target.value })}
                        >
                            <option value="color">Color</option>
                            <option value="black_white">Black & White</option>
                        </select>
                    </div>
                    <div>
                        <label>Side</label>
                        <select
                            value={formData.side}
                            onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                        >
                            <option value="single">Single Side</option>
                            <option value="double">Double Side</option>
                        </select>
                    </div>
                    <div>
                        <label>Price Per Sheet (₹) <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Per Physical Page)</span></label>
                        <p style={{ fontSize: '0.8.5rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                            {formData.side === 'single' ? "Cost for printing on one side of a sheet." : "Cost for printing on BOTH sides of a sheet."}
                        </p>
                        <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={formData.price_per_page}
                            onChange={(e) => setFormData({ ...formData, price_per_page: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Binding Price (₹) (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.binding_price}
                            onChange={(e) => setFormData({ ...formData, binding_price: e.target.value })}
                        />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%' }}>
                            {isSubmitting ? 'Saving...' : 'Save Pricing Rule'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Pricing Table */}
            <div style={{ marginTop: '2rem' }}>
                <h3>Existing Rules</h3>
                {loading ? <p>Loading...</p> : pricings.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem', marginTop: '1rem' }}>
                        <p style={{ fontSize: '1.1rem' }}>No pricing rules set yet.</p>
                        <p style={{ color: 'var(--text-muted)' }}>Add your first price above to start accepting orders.</p>
                    </div>
                ) : (
                    <table className="card" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '0.75rem' }}>Type</th>
                                <th style={{ padding: '0.75rem' }}>Side</th>
                                <th style={{ padding: '0.75rem' }}>Price/Page</th>
                                <th style={{ padding: '0.75rem' }}>Binding</th>
                                <th style={{ padding: '0.75rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricings.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        {p.print_type === 'color' ? '🎨 Color' : '⚫ B&W'}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {p.side === 'single' ? 'Single' : 'Double'}
                                    </td>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>₹{p.price_per_page}</td>
                                    <td style={{ padding: '0.75rem' }}>₹{p.binding_price}</td>
                                    <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                            onClick={() => handleEdit(p)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'red', borderColor: 'red' }}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Delete
                                        </button>
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

export default PricingManagement;
