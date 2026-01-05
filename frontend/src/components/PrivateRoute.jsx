import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roleRequired) {
        try {
            const decoded = jwtDecode(token);
            const userRole = decoded.role; // Custom claim we added in backend

            if (userRole !== roleRequired) {
                // Redirect based on their actual role if they try to access wrong page
                if (userRole === 'customer') {
                    return <Navigate to="/customer" replace />;
                } else if (userRole === 'shop_owner') {
                    return <Navigate to="/dashboard" replace />;
                } else {
                    return <Navigate to="/login" replace />;
                }
            }
        } catch (e) {
            console.error("Token decode failed", e);
            return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
