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
                    <Link to="/admin/buses">Painel do Operador</Link>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Bem-vindo(a), {user?.username || 'Admin'}</span>
                    <nav className="flex gap-4">
                        <Link to="/" className="text-sm hover:text-blue-400">Ir para o Mapa</Link>
                        {/* NOVO LINK ADICIONADO AQUI */}
                        <Link to="/admin/simulator" className="text-sm hover:text-blue-400">Simulador</Link>
                    </nav>
                    <button onClick={handleLogout} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
                        Sair
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