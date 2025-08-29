import useBusStore from '../store/busStore';
import BusListItem from './BusListItem';

const Sidebar = () => {
  const buses = useBusStore((state) => state.buses);

  return (
    <aside className="w-80 flex-shrink-0 bg-gray-800 flex flex-col">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Bus Fleet Tracker</h1>
        <p className="text-sm text-gray-400">Real-time monitoring</p>
      </header>
      
      <div className="p-4">
        <label htmlFor="route-select" className="block text-sm font-medium text-gray-300 mb-2">
          Route
        </label>
        <select 
          id="route-select" 
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option>Route A</option>
          <option>Route B</option>
          {/* Outras rotas podem ser adicionadas aqui no futuro */}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold p-4 sticky top-0 bg-gray-800">
          Active Buses ({buses.length})
        </h2>
        <ul>
          {buses.map((bus) => (
            <BusListItem key={bus.id} bus={bus} />
          ))}
        </ul>
      </div>

      <footer className="p-4 text-center text-xs text-gray-500 border-t border-gray-700">
        &copy; 2025 Bus Tracker Inc.
      </footer>
    </aside>
  );
};

export default Sidebar;