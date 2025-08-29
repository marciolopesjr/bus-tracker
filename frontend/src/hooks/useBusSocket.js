import { useEffect, useRef } from 'react';
import useBusStore from '../store/busStore';

const WEBSOCKET_URL = 'ws://localhost:8090';

/**
 * Custom hook to manage the WebSocket connection for real-time bus position updates.
 * Delegates state update logic to the busStore via the `addOrUpdateBus` action.
 */
const useBusSocket = () => {
  // Seleciona apenas a ação necessária do store.
  // Esta referência é estável e não causará re-renderizações ou loops.
  const addOrUpdateBus = useBusStore((state) => state.addOrUpdateBus);
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) {
      return;
    }
    
    console.log('Attempting to connect to WebSocket server...');
    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established successfully.');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // A lógica agora é muito mais simples aqui
        if (data.type === 'position_update' && typeof data.payload === 'object' && data.payload !== null) {
          // Apenas chamamos a ação do store, que sabe como lidar com a atualização.
          addOrUpdateBus(data.payload);
        } else {
          console.warn('Received unknown message type or invalid payload:', data);
        }
      } catch (error) {
        console.error('Failed to parse incoming WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection died');
      }
      socketRef.current = null; 
    };

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection.');
        socketRef.current.close();
      }
      socketRef.current = null;
    };
    
  }, [addOrUpdateBus]); // A dependência de 'addOrUpdateBus' também é estável.
};

export default useBusSocket;