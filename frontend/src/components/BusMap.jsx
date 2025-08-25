import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useBusStore from '../store';

const fetchBuses = async () => {
  const response = await fetch('/api/routes/1/buses');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const BusMap = () => {
  const { buses, setBuses, updateBusPosition } = useBusStore();

  const { isLoading, error } = useQuery({
    queryKey: ['buses'],
    queryFn: fetchBuses,
    onSuccess: (data) => {
      setBuses(data);
    },
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'BUS_LOCATION_UPDATED') {
        const { busId, lat, lng } = data.payload;
        updateBusPosition(busId, { lat, lng });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [updateBusPosition]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const defaultPosition = [ -23.55052, -46.633308 ]; // São Paulo

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
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
