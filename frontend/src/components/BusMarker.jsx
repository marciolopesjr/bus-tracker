import { FaBus } from 'react-icons/fa';

const BusMarker = ({ isSelected }) => {
  // We use Tailwind CSS classes to change the appearance based on the `isSelected` prop.
  // This provides clear visual feedback to the user.
  const baseClasses = "transition-all duration-200 ease-in-out transform";
  const selectedClasses = "text-blue-500 scale-125";
  const deselectedClasses = "text-gray-900";

  return (
    <div className="p-1 bg-white rounded-full shadow-lg">
      <FaBus 
        size={24}
        className={`${baseClasses} ${isSelected ? selectedClasses : deselectedClasses}`}
      />
    </div>
  );
};

export default BusMarker;