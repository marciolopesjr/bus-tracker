import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../apiClient';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Carrega a chave de API da variável de ambiente.
const BUS_API_KEY = import.meta.env.VITE_BUS_API_KEY;

const LocationSimulatorPage = () => {
  // --- Estados do Componente ---
  const [busId, setBusId] = useState('1');
  const [lat, setLat] = useState(-23.56);
  const [lng, setLng] = useState(-46.65);
  const [isSimulating, setIsSimulating] = useState(false);
  const [step, setStep] = useState(0.0005);
  const [frequency, setFrequency] = useState(2000);

  // --- React Query Mutation ---
  const updateLocationMutation = useMutation({
    mutationFn: (variables) => {
      const { currentBusId, currentLat, currentLng } = variables;
      if (!BUS_API_KEY) {
        throw new Error('A variável de ambiente VITE_BUS_API_KEY não está configurada.');
      }
      return apiClient.post(
        `/api/buses/${currentBusId}/location`,
        { lat: currentLat, lng: currentLng },
        { headers: { 'X-API-Key': BUS_API_KEY } }
      );
    },
  });

  // --- CORREÇÃO: useEffect para gerenciar o ciclo de vida da simulação ---
  useEffect(() => {
    // Se a simulação não estiver ativa, não fazemos nada.
    if (!isSimulating) {
      return;
    }

    let timeoutId;

    const runSimulationStep = async () => {
      try {
        // O loop agora sempre tem acesso aos valores de estado mais recentes (lat, lng, etc.)
        // porque eles estão no array de dependências do useEffect.
        await updateLocationMutation.mutateAsync({
          currentBusId: busId,
          currentLat: lat,
          currentLng: lng,
        });
      } catch (error) {
        console.error("Falha ao enviar a localização:", error);
      } finally {
        // Agenda o próximo passo apenas se a simulação ainda estiver ativa.
        timeoutId = setTimeout(runSimulationStep, frequency);
      }
    };

    // Inicia o primeiro passo do loop.
    runSimulationStep();

    // Função de limpeza: será chamada quando o componente for desmontado
    // ou quando isSimulating se tornar false.
    return () => {
      clearTimeout(timeoutId);
    };
  // O useEffect re-executará (reiniciando o loop) se qualquer um desses valores mudar.
  // Isso é intencional para garantir que o loop sempre use os dados mais recentes.
  }, [isSimulating, lat, lng, busId, frequency, updateLocationMutation]);


  // --- Handlers ---
  const handleToggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  const handleMove = (latMultiplier, lngMultiplier) => {
    setLat(prevLat => prevLat + latMultiplier * step);
    setLng(prevLng => prevLng + lngMultiplier * step);
  };

  const handleStepChange = (e) => {
    const value = parseFloat(e.target.value);
    setStep(isNaN(value) ? 0 : value);
  };

  const handleFrequencyChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFrequency(isNaN(value) ? 200 : value); // Usa 200 como padrão se for NaN
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Simulador de Localização de Ônibus</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna de Configuração e Controles */}
        <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Configurações</h2>
          
          <div className="space-y-4">
             <div>
              <label htmlFor="busId" className="block text-sm font-medium text-gray-300 mb-1">ID do Ônibus</label>
              <input id="busId" type="text" value={busId} onChange={(e) => setBusId(e.target.value)} required disabled={isSimulating}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md disabled:opacity-50" />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="step" className="block text-sm font-medium text-gray-300 mb-1">Passo (incremento)</label>
                    <input id="step" type="number" value={step} onChange={handleStepChange} step="0.0001" disabled={isSimulating}
                        className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md disabled:opacity-50" />
                </div>
                <div className="flex-1">
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-1">Frequência (ms)</label>
                    <input id="frequency" type="number" value={frequency} onChange={handleFrequencyChange} step="100" min="200" disabled={isSimulating}
                        className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md disabled:opacity-50" />
                </div>
            </div>
          </div>
          
           <button onClick={handleToggleSimulation}
            className={`w-full py-3 font-bold text-lg rounded-md transition-colors ${
              isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}>
            {isSimulating ? 'Parar Simulação' : 'Iniciar Simulação'}
          </button>

          <div className="flex justify-center items-center">
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleMove(1, -1)} className="p-4 bg-gray-700 rounded hover:bg-gray-600 transform -rotate-45"><FaArrowUp /></button>
                <button onClick={() => handleMove(1, 0)} className="p-4 bg-gray-700 rounded hover:bg-gray-600"><FaArrowUp /></button>
                <button onClick={() => handleMove(1, 1)} className="p-4 bg-gray-700 rounded hover:bg-gray-600 transform rotate-45"><FaArrowUp /></button>
                
                <button onClick={() => handleMove(0, -1)} className="p-4 bg-gray-700 rounded hover:bg-gray-600"><FaArrowLeft /></button>
                <div className="p-4 text-center text-gray-500">Mover</div>
                <button onClick={() => handleMove(0, 1)} className="p-4 bg-gray-700 rounded hover:bg-gray-600"><FaArrowRight /></button>
                
                <button onClick={() => handleMove(-1, -1)} className="p-4 bg-gray-700 rounded hover:bg-gray-600 transform rotate-45"><FaArrowDown /></button>
                <button onClick={() => handleMove(-1, 0)} className="p-4 bg-gray-700 rounded hover:bg-gray-600"><FaArrowDown /></button>
                <button onClick={() => handleMove(-1, 1)} className="p-4 bg-gray-700 rounded hover:bg-gray-600 transform -rotate-45"><FaArrowDown /></button>
            </div>
          </div>
        </div>

        {/* Coluna de Status e Logs */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Status Atual</h2>
            <div className="space-y-2 font-mono bg-gray-900 p-4 rounded">
                <p>Latitude: <span className="font-bold text-blue-300">{lat.toFixed(6)}</span></p>
                <p>Longitude: <span className="font-bold text-blue-300">{lng.toFixed(6)}</span></p>
            </div>

            <h3 className="text-lg font-bold mt-6 mb-2">Última Resposta do Servidor</h3>
            <div className="h-64 overflow-y-auto bg-gray-900 p-4 rounded text-sm">
                {updateLocationMutation.isPending && <p className="text-yellow-400">Enviando...</p>}
                {updateLocationMutation.isSuccess && (
                    <div className="text-green-300">
                    <h4 className="font-bold">Sucesso!</h4>
                    <pre className="mt-2 whitespace-pre-wrap break-all">
                        {JSON.stringify(updateLocationMutation.data.data, null, 2)}
                    </pre>
                    </div>
                )}
                {updateLocationMutation.isError && (
                    <div className="text-red-300">
                    <h4 className="font-bold">Erro!</h4>
                    <p className="mt-2">
                        {updateLocationMutation.error.response?.data?.error?.description || updateLocationMutation.error.message}
                    </p>
                    </div>
                )}
                 {!updateLocationMutation.isPending && !updateLocationMutation.data && !updateLocationMutation.error && (
                    <p className="text-gray-500">Aguardando envio...</p>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSimulatorPage;