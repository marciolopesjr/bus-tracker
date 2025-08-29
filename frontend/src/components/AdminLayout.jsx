import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <div className="text-xl font-bold">
                    <Link to="/admin/buses">Operator Panel</Link>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Welcome, {user?.username || 'Admin'}</span>
                    <nav className="flex gap-4">
                        <Link to="/" className="text-sm hover:text-blue-400">Go to Map</Link>
                    </nav>
                    <button onClick={handleLogout} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;