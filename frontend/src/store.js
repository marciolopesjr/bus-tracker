import { create } from 'zustand';

const useBusStore = create((set) => ({
  buses: [],
  setBuses: (buses) => set({ buses }),
  updateBusPosition: (busId, newPosition) =>
    set((state) => ({
      buses: state.buses.map((bus) =>
        bus.id === busId ? { ...bus, lat: newPosition.lat, lng: newPosition.lng } : bus
      ),
    })),
}));

export default useBusStore;
