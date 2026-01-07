
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopService, documentService, orderService } from '../services/api';
import { toast } from 'react-toastify';

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [cart, setCart] = useState([]);
    const [newItem, setNewItem] = useState({
        file: null,
        copies: 1,
        print_type: 'black_white',
        side: 'single',
        binding: 'none'
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        shopService.getShop(id).then(res => setShop(res.data)).catch(err => console.error(err));
    }, [id]);

    const handleFileChange = (e) => {
        setNewItem({ ...newItem, file: e.target.files[0] });
    };

    const addToCart = async () => {
        if (!newItem.file) return toast.error("Please upload a file");

        try {
            setUploading(true);
            const docRes = await documentService.upload({ file: newItem.file, file_name: newItem.file.name });
            const documentData = docRes.data; // Should contain total_pages

            const item = {
                ...newItem,
                documentId: documentData.id,
                fileName: newItem.file.name,
                totalPages: documentData.total_pages || 1, // Fallback if 0
                tempId: Date.now()
            };

            setCart([...cart, item]);
            setNewItem({
                file: null,
                copies: 1,
                print_type: 'black_white',
                side: 'single',
                binding: 'none'
            });
            // Reset file input manually if needed or just let react handle key
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const removeFromCart = (tempId) => {
        setCart(cart.filter(item => item.tempId !== tempId));
    };

    const calculateItemPrice = (item) => {
        if (!shop) return 0;
        const pricing = shop.pricings.find(p => p.print_type === item.print_type && p.side === item.side);
        if (!pricing) return 0;

        let cost = parseFloat(pricing.price_per_page) * item.totalPages * item.copies;

        // Add binding cost (Assuming binding price is per copy/book, not per page)
        // Check if binding pricing exists in pricing object or a separate BindingPricing model attached to shop?
        // Current API returns pricings which has 'binding_price' field on the Pricing model itself (as seen in older snippets), 
        // OR we have a separate BindingPricing model. The current Pricing model snippet showed binding_price field.
        if (item.binding !== 'none' && pricing.binding_price) {
            cost += parseFloat(pricing.binding_price) * item.copies;
        }

        return cost;
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + calculateItemPrice(item), 0);
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");

        try {
            const itemsPayload = cart.map(item => ({
                document: item.documentId,
                copies: item.copies,
                print_type: item.print_type,
                side: item.side,
                binding: item.binding,
                price: calculateItemPrice(item)
            }));

            await orderService.create({
                shop: shop.id,
                items: itemsPayload,
                total_price: calculateTotal()
            });

            toast.success("Order Placed Successfully!");
            navigate('/customer/orders');
        } catch (err) {
            console.error(err);
            toast.error("Order Failed");
        }
    };

    if (!shop) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h2 style={{ color: 'var(--primary-color)' }}>Order at {shop.shop_name}</h2>
            <p>{shop.location}</p>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3>Add Documents</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label>Upload Document (PDF/DOC)</label>
                            <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" key={newItem.file ? 'file-uploaded' : 'file-empty'} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Copies</label>
                                <input type="number" min="1" value={newItem.copies} onChange={e => setNewItem({ ...newItem, copies: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label>Binding</label>
                                <select value={newItem.binding} onChange={e => setNewItem({ ...newItem, binding: e.target.value })}>
                                    <option value="none">None</option>
                                    <option value="spiral">Spiral</option>
                                    <option value="hard">Hard Binding</option>
                                </select>
                            </div>
                            <div>
                                <label>Print Type</label>
                                <select value={newItem.print_type} onChange={e => setNewItem({ ...newItem, print_type: e.target.value })}>
                                    <option value="black_white">Black & White</option>
                                    <option value="color">Color</option>
                                </select>
                            </div>
                            <div>
                                <label>Sides</label>
                                <select value={newItem.side} onChange={e => setNewItem({ ...newItem, side: e.target.value })}>
                                    <option value="single">Single Side</option>
                                    <option value="double">Double Side</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-outline" onClick={addToCart} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Add to Order'}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h3>Your Order</h3>
                    {cart.length === 0 ? (
                        <p>No items added yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.tempId} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{item.fileName}</strong>
                                        <span>₹{calculateItemPrice(item).toFixed(2)}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {item.copies} copy(s) | {item.totalPages} pg | {item.print_type} | {item.side} | {item.binding}
                                    </div>
                                    <button
                                        style={{ background: 'none', border: 'none', color: 'red', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                                        onClick={() => removeFromCart(item.tempId)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Total Estimate</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopDetails;

