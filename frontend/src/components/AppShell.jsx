import { Outlet } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

const AppShell = () => {
  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col font-sans overflow-hidden">
      <main className="flex-1 relative">
        {/* As páginas (TrackerPage, RoutesPage, etc.) serão renderizadas aqui */}
        <Outlet />
      </main>
      
      {/* A barra de navegação fica na parte inferior, sobrepondo a 'main' */}
      <BottomNavBar />
    </div>
  );
};

export default AppShell;