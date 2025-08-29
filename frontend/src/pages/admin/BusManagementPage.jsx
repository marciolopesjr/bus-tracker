import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../apiClient';
import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

// This could be its own component file, but is simple enough to be here for now.
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
      <h3 className="mb-2 text-lg font-semibold">{bus ? 'Edit Bus' : 'Create New Bus'}</h3>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          placeholder="e.g., BUS-123"
          required
          className="flex-grow px-3 py-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Save
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600">
            Cancel
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
  const [editingBus, setEditingBus] = useState(null); // null, 'new', or a bus object
  
  // --- React Query Hooks ---

  const { data: buses = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminBuses'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/buses');
      
      // THE FIX IS HERE: The admin endpoint is also wrapping the array in a 'data' property,
      // contrary to the OpenAPI spec. We now correctly access `response.data.data`.
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Fallback for if the API ever returns a direct array (to match the spec).
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.error("Unexpected API response structure for admin bus list.", response.data);
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
    if (editingBus && editingBus.id) { // Editing existing bus
      updateBusMutation.mutate({ ...busData, id: editingBus.id });
    } else { // Creating new bus
      createBusMutation.mutate(busData);
    }
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      deleteBusMutation.mutate(busId);
    }
  };


  // --- Render Logic ---

  if (isLoading) return <div className="p-8 text-center">Loading bus fleet...</div>;
  if (isError) return <div className="p-8 text-center text-red-400">Error: {error.response?.data?.error?.description || error.message}</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bus Fleet Management</h1>
        {editingBus === null && (
           <button onClick={() => setEditingBus('new')} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
            <FaPlus />
            Add New Bus
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
              <th scope="col" className="px-6 py-3">License Plate</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
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