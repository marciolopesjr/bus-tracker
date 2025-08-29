import PropTypes from 'prop-types';
import useBusStore from '../store/busStore';

const BusListItem = ({ bus }) => {
  // Aplicando o mesmo padrão de seletor atômico
  const selectedBusId = useBusStore((state) => state.selectedBusId);
  const setSelectedBusId = useBusStore((state) => state.setSelectedBusId);
  
  const isSelected = bus.id === selectedBusId;

  const handleClick = () => {
    setSelectedBusId(isSelected ? null : bus.id);
  };

  return (
    <li
      className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${
        isSelected
          ? 'bg-blue-500/30'
          : 'hover:bg-gray-700/50'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div>
            <span className="font-semibold text-white">{bus.license_plate}</span>
            <p className="text-xs text-gray-400">ID: {bus.id}</p>
        </div>
      </div>
    </li>
  );
};

BusListItem.propTypes = {
    bus: PropTypes.shape({
        id: PropTypes.number.isRequired,
        license_plate: PropTypes.string.isRequired,
    }).isRequired,
};


export default BusListItem;