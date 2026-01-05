import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await authService.login(formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Backend now explicitly returns role in the response body as well
            const role = response.data.role;

            toast.success('Login Successful!');

            if (role === 'customer') {
                navigate('/customer');
            } else if (role === 'shop_owner') {
                if (response.data.has_shop) {
                    navigate('/owner/dashboard');
                } else {
                    navigate('/owner/register-shop');
                }
            } else {
                // Fallback or Admin
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            toast.error('Invalid Credentials');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Welcome Back</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Login to your account</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
