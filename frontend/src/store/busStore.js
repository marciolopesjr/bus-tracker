import { create } from 'zustand';

const useBusStore = create((set) => ({
  buses: [],
  selectedBusId: null,

  setBuses: (initialBuses) => set({ buses: initialBuses }),

  addOrUpdateBus: (busData) => set((state) => {
    // --- CORREÇÃO ESTÁ AQUI ---
    // Normaliza o objeto de dados recebido para corresponder à estrutura de estado interna da nossa aplicação.
    // Independentemente da fonte, garantimos que sempre usamos 'lat' e 'lng'.
    const normalizedBus = {
      id: busData.id,
      license_plate: busData.license_plate,
      // Mapeia 'current_lat' para 'lat' e 'current_lng' para 'lng'.
      // O operador '??' (nullish coalescing) serve como um fallback caso o objeto já venha com 'lat'.
      lat: busData.current_lat ?? busData.lat,
      lng: busData.current_lng ?? busData.lng,
    };

    // Agora, usamos o objeto normalizado para a lógica de atualização.
    const busExists = state.buses.some(bus => bus.id === normalizedBus.id);

    let updatedBuses;
    if (busExists) {
      updatedBuses = state.buses.map(bus =>
        bus.id === normalizedBus.id ? { ...bus, ...normalizedBus } : bus
      );
    } else {
      updatedBuses = [...state.buses, normalizedBus];
    }
    
    return { buses: updatedBuses };
  }),
  
  setSelectedBusId: (id) => set({ selectedBusId: id }),
}));

export default useBusStore;