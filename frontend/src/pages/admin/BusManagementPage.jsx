// src/pages/admin/BusManagementPage.jsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../apiClient';
import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Este poderia ser seu próprio arquivo de componente, mas é simples o suficiente para ficar aqui por enquanto.
const BusForm = ({ bus, onSave, onCancel }) => {
  const [licensePlate, setLicensePlate] = useState(bus ? bus.license_plate : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (licensePlate.trim()) {
      onSave({ license_plate: licensePlate.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mt-4 mb-6 bg-gray-700 rounded-lg">
      <h3 className="mb-2 text-lg font-semibold">{bus ? 'Editar Ônibus' : 'Criar Novo Ônibus'}</h3>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          placeholder="ex: ABC-1234"
          required
          className="flex-grow px-3 py-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Salvar
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

BusForm.propTypes = {
    bus: PropTypes.shape({
        id: PropTypes.number,
        license_plate: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};


const BusManagementPage = () => {
  const queryClient = useQueryClient();
  const [editingBus, setEditingBus] = useState(null); // null, 'new', ou um objeto bus
  
  // --- React Query Hooks ---

  const { data: buses = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminBuses'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/buses');
      
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.error("Estrutura de resposta da API inesperada para a lista de ônibus do admin.", response.data);
      return [];
    },
    retry: (failureCount, error) => {
      return error.response?.status !== 401 && failureCount < 3;
    },
  });

  const createBusMutation = useMutation({
    mutationFn: (newBus) => apiClient.post('/api/admin/buses', newBus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBuses'] });
      setEditingBus(null);
    },
  });

  const updateBusMutation = useMutation({
    mutationFn: (updatedBus) => apiClient.put(`/api/admin/buses/${updatedBus.id}`, { license_plate: updatedBus.license_plate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBuses'] });
      setEditingBus(null);
    },
  });

  const deleteBusMutation = useMutation({
    mutationFn: (busId) => apiClient.delete(`/api/admin/buses/${busId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBuses'] });
    },
  });


  // --- Event Handlers ---

  const handleSaveBus = (busData) => {
    if (editingBus && editingBus.id) { // Editando ônibus existente
      updateBusMutation.mutate({ ...busData, id: editingBus.id });
    } else { // Criando novo ônibus
      createBusMutation.mutate(busData);
    }
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm('Você tem certeza que deseja excluir este ônibus?')) {
      deleteBusMutation.mutate(busId);
    }
  };


  // --- Render Logic ---

  if (isLoading) return <div className="p-8 text-center">Carregando a frota de ônibus...</div>;
  if (isError) return <div className="p-8 text-center text-red-400">Erro: {error.response?.data?.error?.description || error.message}</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento da Frota</h1>
        {editingBus === null && (
           <button onClick={() => setEditingBus('new')} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
            <FaPlus />
            Adicionar Novo Ônibus
          </button>
        )}
      </div>

      {(editingBus === 'new' || (editingBus && editingBus.id)) && (
        <BusForm 
          bus={editingBus !== 'new' ? editingBus : null}
          onSave={handleSaveBus}
          onCancel={() => setEditingBus(null)} 
        />
      )}

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-100 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Placa</th>
              <th scope="col" className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4">{bus.id}</td>
                <td className="px-6 py-4 font-medium">{bus.license_plate}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setEditingBus(bus)} className="mr-4 text-blue-400 hover:text-blue-300">
                    <FaEdit size={16} />
                  </button>
                  <button onClick={() => handleDeleteBus(bus.id)} className="text-red-500 hover:text-red-400">
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusManagementPage;