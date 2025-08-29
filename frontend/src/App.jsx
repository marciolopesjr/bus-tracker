import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TrackerPage from './pages/TrackerPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import BusManagementPage from './pages/admin/BusManagementPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TrackerPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />, // This route now protects all its children
    children: [
        {
            element: <AdminLayout />,
            children: [
                {
                    path: 'buses',
                    element: <BusManagementPage />
                }
                // Future admin pages can be added here
            ]
        }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;