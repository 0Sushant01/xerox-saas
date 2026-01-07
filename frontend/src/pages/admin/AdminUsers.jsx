import { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminService.getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        if (roleFilter === 'all') return true;
        return user.role === roleFilter;
    });

    if (loading) return <div>Loading Users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#111827', margin: 0 }}>Manage Users</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem' }}>Filter Role:</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                    >
                        <option value="all">All Roles</option>
                        <option value="shop_owner">Shop Owners</option>
                        <option value="customer">Customers</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Email / Username</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Role</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Date Joined</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', color: '#111827' }}>
                                        <div style={{ fontWeight: 500 }}>{user.email}</div>
                                        {user.username !== user.email && <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{user.username}</div>}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            backgroundColor: user.role === 'admin' ? '#fce7f3' : (user.role === 'shop_owner' ? '#e0f2fe' : '#f3f4f6'),
                                            color: user.role === 'admin' ? '#be185d' : (user.role === 'shop_owner' ? '#0369a1' : '#374151')
                                        }}>
                                            {user.role === 'shop_owner' ? 'Shop Owner' : (user.role === 'admin' ? 'Admin' : 'Customer')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                                        {new Date(user.date_joined).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {/* Placeholder for block/reset */}
                                        <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>--</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
