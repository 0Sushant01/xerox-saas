import React, { useState, useEffect } from 'react';
import { pricingService } from '../services/api';

const BindingPricingManager = () => {
    const [bindingPrices, setBindingPrices] = useState([]);
    const [formData, setFormData] = useState({
        binding_type: 'soft',
        price: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const BINDING_TYPES = [
        { value: 'soft', label: 'Soft Binding' },
        { value: 'hard', label: 'Hard Binding' },
        { value: 'spiral', label: 'Spiral Binding' },
    ];

    useEffect(() => {
        fetchBindingPrices();
    }, []);

    const fetchBindingPrices = async () => {
        try {
            const response = await pricingService.listBinding();
            setBindingPrices(response.data);
        } catch (err) {
            console.error("Failed to fetch binding prices", err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await pricingService.createBinding(formData);
            setSuccess('Binding price updated successfully.');
            setFormData({ ...formData, price: '' }); // Reset price but keep type
            fetchBindingPrices();
        } catch (err) {
            setError('Failed to update binding price.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this binding price?")) return;
        try {
            await pricingService.deleteBinding(id);
            fetchBindingPrices();
        } catch (err) {
            setError('Failed to delete binding price.');
        }
    };

    const getBindingLabel = (type) => {
        const found = BINDING_TYPES.find(t => t.value === type);
        return found ? found.label : type;
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Binding Prices</h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Binding Type</label>
                        <select
                            name="binding_type"
                            value={formData.binding_type}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {BINDING_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
                        >
                            {loading ? 'Saving...' : 'Set Price'}
                        </button>
                    </div>
                </div>
            </form>

            {bindingPrices.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Binding Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bindingPrices.map((bp) => (
                                <tr key={bp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBindingLabel(bp.binding_type)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bp.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(bp.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No binding prices set yet.</p>
            )}
        </div>
    );
};

export default BindingPricingManager;
