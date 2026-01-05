import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { shopService } from '../services/api'; // Or a userService if we had one for 'me'

const Dashboard = () => {
    // Since we didn't modify JWT to include 'role', we can't know it immediately.
    // However, the prompt asked for "Clean serializers", not necessarily custom JWT claims.
    // We can infer role or fetch it. But wait, `Register` sets role. `Login` returns token.
    // Let's create a 'My Profile' endpoint or just try to access Shop Owner features.
    // Or we can just have a generic Dashboard that shows options based on API data.

    // For MVP: Let's show a generic dashboard with "Find Shops" (Customer) and "My Shop" (Owner).
    // If "My Shop" API returns a shop, they are an owner.

    return (
        <div className="container">
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3>Customer Actions</h3>
                    <p>Find nearby shops and place orders.</p>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/shops'}>Browse Shops</button>
                    <div style={{ marginTop: '1rem' }}>
                        <a href="/orders" style={{ color: 'var(--primary-color)' }}>Track My Orders</a>
                    </div>
                </div>

                <div className="card">
                    <h3>Shop Owner Actions</h3>
                    <p>Manage your shop, pricing and incoming orders.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/shop-admin'}>View Orders</button>
                        <button className="btn btn-outline" onClick={() => window.location.href = '/manage-shop'}>Shop Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
