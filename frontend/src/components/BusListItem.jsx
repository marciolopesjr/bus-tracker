import useBusStore from '../store/busStore';

const BusListItem = ({ bus }) => {
  const { selectedBusId, setSelectedBusId } = useBusStore();
  const isSelected = bus.id === selectedBusId;

  const handleClick = () => {
    // Alterna a seleção ou seleciona se não estiver selecionado
    setSelectedBusId(isSelected ? null : bus.id);
  };

  return (
    <li
      className={`px-4 py-3 cursor-pointer border-l-4 ${
        isSelected
          ? 'bg-blue-900/50 border-blue-500'
          : 'border-transparent hover:bg-gray-700/50'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{bus.license_plate}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
        }`}>
          ID: {bus.id}
        </span>
      </div>
    </li>
  );
};

export default BusListItem;