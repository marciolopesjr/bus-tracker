import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import useBusStore from '../store/busStore';
import useBusSocket from '../hooks/useBusSocket';

const fetchBuses = async () => {
  const res = await fetch('/api/routes/1/buses');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const BusMap = () => {
  const { data: initialBuses, isLoading, isError } = useQuery({
    queryKey: ['buses'],
    queryFn: fetchBuses,
  });
  const { buses, setBuses, updateBusPosition } = useBusStore();

  useBusSocket({ setBuses, updateBusPosition });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <MapContainer center={[-23.55052, -46.633308]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {buses.map((bus) => (
        <Marker key={bus.id} position={[bus.lat, bus.lng]}>
          <Popup>
            Bus ID: {bus.id}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BusMap;
