// src/components/BottomNavBar.jsx

import { NavLink } from 'react-router-dom';
import { FaMapMarkedAlt, FaRoute, FaInfoCircle } from 'react-icons/fa';

const BottomNavBar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 transition-colors duration-200 ${
      isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
    }`;

  return (
    <nav className="w-full h-16 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 flex z-20">
      <NavLink to="/" className={navLinkClasses} end>
        <FaMapMarkedAlt size={22} />
        <span className="text-xs mt-1">Mapa</span>
      </NavLink>
      <NavLink to="/routes" className={navLinkClasses}>
        <FaRoute size={22} />
        <span className="text-xs mt-1">Rotas</span>
      </NavLink>
      <NavLink to="/contact" className={navLinkClasses}>
        <FaInfoCircle size={22} />
        <span className="text-xs mt-1">Contato</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavBar;