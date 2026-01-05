import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopService, documentService, orderService } from '../services/api';
import { toast } from 'react-toastify';

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [file, setFile] = useState(null);
    const [orderConfig, setOrderConfig] = useState({
        copies: 1,
        print_type: 'black_white',
        side: 'single',
        binding: 'none'
    });

    useEffect(() => {
        shopService.getShop(id).then(res => setShop(res.data)).catch(err => console.error(err));
    }, [id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please upload a file");

        try {
            // 1. Upload Document
            const docRes = await documentService.upload({ file, file_name: file.name });
            const documentId = docRes.data.id;

            // 2. Calculate Price (Simple logic for MVP display, ideally backend recalculates)
            // Finding price config
            const pricing = shop.pricings.find(p => p.print_type === orderConfig.print_type && p.side === orderConfig.side);
            let price = pricing ? parseFloat(pricing.price_per_page) * orderConfig.copies : 0;
            if (pricing && pricing.binding_price && orderConfig.binding !== 'none') {
                price += parseFloat(pricing.binding_price);
            }
            // Note: Simplification. Ideally multiply by page count, but page count is extracted server side or assumed 1 for now if not parsed.
            // Let's assume price per page * copies for now. Backend 'total_page' logic requires PDF parsing libs.

            // 3. Place Order
            await orderService.create({
                shop: shop.id,
                document: documentId,
                ...orderConfig,
                total_price: price || 10.00 // Fallback or calculated
            });

            toast.success("Order Placed Successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error("Order Failed");
        }
    };

    if (!shop) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div className="card">
                <h2>Place Order at {shop.shop_name}</h2>
                <p>{shop.location}</p>
                <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />

                <form onSubmit={handlePlaceOrder}>
                    <div>
                        <label>Upload Document (PDF/DOC)</label>
                        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Copies</label>
                            <input
                                type="number"
                                min="1"
                                value={orderConfig.copies}
                                onChange={e => setOrderConfig({ ...orderConfig, copies: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Binding</label>
                            <select value={orderConfig.binding} onChange={e => setOrderConfig({ ...orderConfig, binding: e.target.value })}>
                                <option value="none">None</option>
                                <option value="spiral">Spiral</option>
                                <option value="hard">Hard Binding</option>
                            </select>
                        </div>
                        <div>
                            <label>Print Type</label>
                            <select value={orderConfig.print_type} onChange={e => setOrderConfig({ ...orderConfig, print_type: e.target.value })}>
                                <option value="black_white">Black & White</option>
                                <option value="color">Color</option>
                            </select>
                        </div>
                        <div>
                            <label>Sides</label>
                            <select value={orderConfig.side} onChange={e => setOrderConfig({ ...orderConfig, side: e.target.value })}>
                                <option value="single">Single Side</option>
                                <option value="double">Double Side</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShopDetails;
