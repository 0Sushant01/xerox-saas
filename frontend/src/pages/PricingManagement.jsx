import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { pricingService } from '../services/api';

const PricingCard = ({ title, subtitle, value, onChange, subtext, highlight }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: highlight ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }}>
        <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginTop: '2px' }}>{subtitle}</p>}
        </div>
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: '500' }}>₹</span>
            <input
                type="number"
                step="0.01"
                min="0"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0.00"
                style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    outline: 'none'
                }}
            />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{subtext}</p>
    </div>
);

const PricingManagement = () => {
    // State for all 7 slots
    // Keys: bw_single, bw_double, color_single, color_double
    //       soft, hard, spiral
    const [prices, setPrices] = useState({
        bw_single: '',
        bw_double: '',
        color_single: '',
        color_double: '',
        soft: '',
        hard: '',
        spiral: ''
    });

    const [originalPrices, setOriginalPrices] = useState({}); // To detect changes
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        fetchAllPrices();
    }, []);

    const fetchAllPrices = async () => {
        try {
            setLoading(true);
            const [printRes, bindingRes] = await Promise.all([
                pricingService.list(),
                pricingService.listBinding()
            ]);

            const newPrices = {
                bw_single: '', bw_double: '', color_single: '', color_double: '',
                soft: '', hard: '', spiral: ''
            };

            // Map Print Pricing
            printRes.data.forEach(p => {
                const key = `${p.print_type}_${p.side}`; // e.g., black_white_single
                if (key === 'black_white_single') newPrices.bw_single = p.price_per_page;
                else if (key === 'black_white_double') newPrices.bw_double = p.price_per_page;
                else if (key === 'color_single') newPrices.color_single = p.price_per_page;
                else if (key === 'color_double') newPrices.color_double = p.price_per_page;
            });

            // Map Binding Pricing
            bindingRes.data.forEach(p => {
                if (p.binding_type === 'soft') newPrices.soft = p.price;
                else if (p.binding_type === 'hard') newPrices.hard = p.price;
                else if (p.binding_type === 'spiral') newPrices.spiral = p.price;
            });

            setPrices(newPrices);
            setOriginalPrices(JSON.parse(JSON.stringify(newPrices)));
            setUnsavedChanges(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load pricing.");
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (key, val) => {
        setPrices(prev => {
            const next = { ...prev, [key]: val };
            // Check if different from original
            const isDirty = JSON.stringify(next) !== JSON.stringify(originalPrices);
            setUnsavedChanges(isDirty);
            return next;
        });
    };

    const saveAll = async () => {
        setSaving(true);
        const promises = [];

        // Save Print Prices
        // Note: Backend might need specific calls. We'll iterate.
        const printMap = [
            { key: 'bw_single', type: 'black_white', side: 'single' },
            { key: 'bw_double', type: 'black_white', side: 'double' },
            { key: 'color_single', type: 'color', side: 'single' },
            { key: 'color_double', type: 'color', side: 'double' },
        ];

        printMap.forEach(item => {
            const price = prices[item.key];
            if (price && price != originalPrices[item.key]) {
                promises.push(pricingService.create({
                    print_type: item.type,
                    side: item.side,
                    price_per_page: price
                }));
            }
        });

        // Save Binding Prices
        const bindingMap = ['soft', 'hard', 'spiral'];
        bindingMap.forEach(type => {
            const price = prices[type];
            if (price && price != originalPrices[type]) {
                promises.push(pricingService.createBinding({
                    binding_type: type,
                    price: price
                }));
            }
        });

        try {
            await Promise.all(promises);
            toast.success("All prices saved successfully.");
            setOriginalPrices(JSON.parse(JSON.stringify(prices))); // Update original to current
            setUnsavedChanges(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to save some prices.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading pricing...</div>;

    return (
        <div style={{ paddingBottom: '100px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1000px' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Pricing Management</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Set your standard per-sheet rates and binding costs.</p>
                </header>

                {/* Print Pricing Section */}
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>Print Pricing (Per Sheet)</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        <PricingCard
                            title="Black & White"
                            subtitle="One Side"
                            value={prices.bw_single}
                            onChange={(v) => handlePriceChange('bw_single', v)}
                            subtext="Per sheet cost"
                        />
                        <PricingCard
                            title="Black & White"
                            subtitle="Two Side"
                            value={prices.bw_double}
                            onChange={(v) => handlePriceChange('bw_double', v)}
                            subtext="Per sheet cost"
                        />
                        <PricingCard
                            title="Color"
                            subtitle="One Side"
                            value={prices.color_single}
                            onChange={(v) => handlePriceChange('color_single', v)}
                            subtext="Per sheet cost"
                            highlight
                        />
                        <PricingCard
                            title="Color"
                            subtitle="Two Side"
                            value={prices.color_double}
                            onChange={(v) => handlePriceChange('color_double', v)}
                            subtext="Per sheet cost"
                            highlight
                        />
                    </div>
                </section>

                {/* Binding Pricing Section */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem', borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>Binding Pricing</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        <PricingCard
                            title="Soft Binding"
                            value={prices.soft}
                            onChange={(v) => handlePriceChange('soft', v)}
                            subtext="Added once per order"
                        />
                        <PricingCard
                            title="Hard Binding"
                            value={prices.hard}
                            onChange={(v) => handlePriceChange('hard', v)}
                            subtext="Added once per order"
                        />
                        <PricingCard
                            title="Spiral Binding"
                            value={prices.spiral}
                            onChange={(v) => handlePriceChange('spiral', v)}
                            subtext="Added once per order"
                        />
                    </div>
                </section>
            </div>

            {/* Sticky Save Bar */}
            {unsavedChanges && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTop: '1px solid #e5e7eb',
                    padding: '1rem',
                    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 50
                }}>
                    <div className="container mx-auto px-4" style={{ maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#fde047' }}></span>
                            <span style={{ color: '#b45309', fontWeight: '500' }}>You have unsaved changes</span>
                        </div>
                        <button
                            onClick={saveAll}
                            disabled={saving}
                            style={{
                                backgroundColor: '#2563eb',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                border: 'none',
                                opacity: saving ? 0.7 : 1,
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingManagement;
