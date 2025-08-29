// src/components/BusInfoPanel.jsx

import useBusStore from '../store/busStore';
import BusListItem from './BusListItem';
import { FaArrowLeft } from 'react-icons/fa';

const BusInfoPanel = () => {
  const buses = useBusStore((state) => state.buses);
  const selectedBusId = useBusStore((state) => state.selectedBusId);
  const setSelectedBusId = useBusStore((state) => state.setSelectedBusId);
  
  const selectedBus = selectedBusId ? buses.find(bus => bus.id === selectedBusId) : null;

  const handleClearSelection = () => {
    setSelectedBusId(null);
  };

  const renderContent = () => {
    if (selectedBus) {
      return (
        <div className="flex flex-col h-full">
          <header className="flex items-center p-4 border-b border-gray-700 flex-shrink-0">
            <button
              onClick={handleClearSelection}
              className="mr-4 p-2 rounded-full hover:bg-gray-600"
              aria-label="Voltar para a lista"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-lg font-bold">Detalhes do Ônibus</h2>
          </header>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Placa</p>
                <p className="text-2xl font-semibold">{selectedBus.license_plate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">ID do Ônibus</p>
                <p className="font-mono text-lg">{selectedBus.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Posição Atual</p>
                <p className="font-mono text-lg">{`${selectedBus.lat.toFixed(6)}, ${selectedBus.lng.toFixed(6)}`}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <div>
                 <h1 className="text-xl font-bold">Ônibus Ativos</h1>
                 <p className="text-sm text-gray-400">
                    {buses.length > 0 ? `${buses.length} ônibus sendo rastreados` : 'Nenhum ônibus ativo'}
                </p>
            </div>
            <div className="w-10 h-1.5 bg-gray-600 rounded-full" />
        </header>
        <div className="flex-1 overflow-y-auto">
          {buses.length > 0 ? (
            <ul>
              {buses.map((bus) => (
                <BusListItem key={bus.id} bus={bus} />
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-gray-400">Aguardando dados dos ônibus...</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="absolute bottom-0 inset-x-0 mx-2 mb-20 h-[40vh] max-h-72 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-2xl z-10 overflow-hidden transition-transform duration-300 ease-in-out">
      <div className="h-full">
        {renderContent()}
      </div>
    </aside>
  );
};

export default BusInfoPanel;