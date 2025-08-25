import { create } from 'zustand';

const useBusStore = create((set) => ({
  buses: [],
  setBuses: (buses) => set({ buses }),
  updateBusPosition: (updatedBus) =>
    set((state) => ({
      buses: state.buses.map((bus) =>
        bus.id === updatedBus.id ? { ...bus, ...updatedBus } : bus
      ),
    })),
}));

export default useBusStore;
