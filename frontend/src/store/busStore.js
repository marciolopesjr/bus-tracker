import { create } from 'zustand';

const useBusStore = create((set) => ({
  buses: [],
  selectedBusId: null, // ID do ônibus selecionado
  setBuses: (buses) => set({ buses }),
  setSelectedBusId: (id) => set({ selectedBusId: id }),
}));

export default useBusStore;