import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        role: 'customer'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (formData.password !== formData.confirm_password) {
            setErrors({ confirm_password: ["Passwords do not match"] });
            setIsSubmitting(false);
            return;
        }

        try {
            await authService.register(formData);
            toast.success('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(err.response.data);
                toast.error('Registration Failed. Please check the form.');
            } else {
                toast.error('Registration Failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Join Xerox SaaS today</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.email && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{errors.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.username && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{errors.username}</div>}
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.password && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{errors.password}</div>}
                    </div>

                    <div>
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            required
                            value={formData.confirm_password}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.confirm_password && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{errors.confirm_password}</div>}
                    </div>

                    <div>
                        <label htmlFor="role">I am a:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        >
                            <option value="customer">Customer</option>
                            <option value="shop_owner">Shop Owner</option>
                        </select>
                        {errors.role && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{errors.role}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                    {errors.non_field_errors && <div style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>{errors.non_field_errors}</div>}

                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
