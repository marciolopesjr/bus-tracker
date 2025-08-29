import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import TrackerPage from './pages/TrackerPage';
import RoutesPage from './pages/RoutesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import BusManagementPage from './pages/admin/BusManagementPage';
// NOVA IMPORTAÇÃO
import LocationSimulatorPage from './pages/admin/LocationSimulatorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <TrackerPage />,
      },
      {
        path: 'routes',
        element: <RoutesPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="buses" replace /> },
          {
            path: 'buses',
            element: <BusManagementPage />
          },
          // NOVA ROTA ADICIONADA AQUI
          {
            path: 'simulator',
            element: <LocationSimulatorPage />
          }
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;