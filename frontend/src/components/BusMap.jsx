import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useQuery } from '@tanstack/react-query';
import useBusStore from '../store/busStore';
import BusMarker from './BusMarker';

// --- Configuration ---
const API_URL = 'http://localhost:8069/api/routes/1/buses'; 
// REFETCH_INTERVAL_MS is no longer needed with WebSockets
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// --- Map Constants ---
const MAP_CENTER = { lat: -23.55052, lng: -46.633308 };
const MAP_ID = 'BUS_TRACKER_MAP';
const MAP_OPTIONS = {
  center: MAP_CENTER,
  zoom: 13,
  mapId: MAP_ID,
  disableDefaultUI: true,
  zoomControl: true,
};

// --- Helper Function to Load Google Maps Script ---
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  const existingScript = document.getElementById('googleMapsScript');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }

  const script = document.createElement('script');
  script.id = 'googleMapsScript';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&libraries=marker&callback=initMap`;
  script.async = true;
  script.defer = true;
  window.initMap = callback;
  document.head.appendChild(script);
};

// --- The React Component ---
const BusMap = () => {
  const { buses, setBuses, selectedBusId, setSelectedBusId } = useBusStore();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const infoWindowRef = useRef(null);

  const { data: fetchedBuses, isError, error } = useQuery({
    queryKey: ['buses'],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Network response was not ok');
      const payload = await res.json();
      
      if (payload && Array.isArray(payload.data)) {
        return payload.data.map(bus => ({
          id: bus.id,
          license_plate: bus.license_plate,
          lat: bus.current_lat,
          lng: bus.current_lng,
        }));
      }

      console.error("Unexpected API response structure for public bus route.", payload);
      return [];
    },
    // THE CHANGE IS HERE: refetchInterval has been removed.
    // This query now runs only once to get the initial state.
  });

  useEffect(() => {
    // This effect ensures the initial state from the HTTP fetch is loaded into the store.
    // Subsequent updates will come from the WebSocket via useBusSocket.
    if (fetchedBuses) {
      setBuses(fetchedBuses);
    }
  }, [fetchedBuses, setBuses]);

  // Effect for Initializing the Map
  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = new window.google.maps.Map(mapContainerRef.current, MAP_OPTIONS);
        infoWindowRef.current = new window.google.maps.InfoWindow();
        
        infoWindowRef.current.addListener('closeclick', () => {
          setSelectedBusId(null);
        });
      }
    });
  }, [setSelectedBusId]);

  // Effect for Syncing Markers with Bus Data
  useEffect(() => {
    if (!mapRef.current || !buses) return; 

    const currentBusIds = new Set(buses.map(bus => bus.id));
    
    markersRef.current.forEach((markerData, busId) => {
      if (!currentBusIds.has(busId)) {
        markerData.root.unmount();
        markerData.marker.map = null;
        markersRef.current.delete(busId);
      }
    });

    buses.forEach((bus) => {
      const pos = { lat: bus.lat, lng: bus.lng };
      if (markersRef.current.has(bus.id)) {
        markersRef.current.get(bus.id).marker.position = pos;
      } else {
        const markerNode = document.createElement('div');
        const root = createRoot(markerNode);
        root.render(<BusMarker isSelected={false} />);

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: pos,
          map: mapRef.current,
          title: `Bus ${bus.license_plate}`,
          content: markerNode,
        });

        marker.addListener('click', () => setSelectedBusId(bus.id));
        markersRef.current.set(bus.id, { marker, root, node: markerNode });
      }
    });
  }, [buses, setSelectedBusId]);

  // Effect for Handling Selection (Info Window and Marker Style)
  useEffect(() => {
    markersRef.current.forEach((markerData, busId) => {
      markerData.root.render(<BusMarker isSelected={busId === selectedBusId} />);
    });
    
    if (!mapRef.current || !infoWindowRef.current || !buses) return;
    const selectedBus = buses.find(bus => bus.id === selectedBusId);
    
    if (selectedBus) {
      const markerData = markersRef.current.get(selectedBus.id);
      if (markerData) {
        const content = `<div class="text-gray-900"><h4 class="font-bold">Bus: ${selectedBus.license_plate}</h4><p>ID: ${selectedBus.id}</p></div>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open({ anchor: markerData.marker, map: mapRef.current });
        mapRef.current.panTo(markerData.marker.position);
      }
    } else {
      infoWindowRef.current.close();
    }
  }, [selectedBusId, buses]);

  if (isError) return <div className="flex items-center justify-center h-full bg-red-900 text-white">Error: {error.message}</div>;

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

export default BusMap;