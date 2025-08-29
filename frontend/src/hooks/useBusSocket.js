import { useEffect } from 'react';
import useBusStore from '../store/busStore';

const WEBSOCKET_URL = 'ws://localhost:8090';

/**
 * Custom hook to manage the WebSocket connection for real-time bus position updates.
 * It connects on mount and disconnects on unmount, updating the global busStore
 * whenever a 'positions_update' message is received.
 */
const useBusSocket = () => {
  // Get the state setter function directly from our Zustand store.
  const setBuses = useBusStore((state) => state.setBuses);

  useEffect(() => {
    console.log('Attempting to connect to WebSocket server...');
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log('WebSocket connection established successfully.');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle incoming messages based on their type.
        if (data.type === 'positions_update' && Array.isArray(data.payload)) {
          // As per the new architecture, we replace the entire list of buses
          // with the fresh data from the payload.
          setBuses(data.payload);
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
        // e.g. server process killed or network down
        console.error('WebSocket connection died');
      }
    };

    // Cleanup function: This is crucial to prevent memory leaks and
    // multiple connections when the component unmounts.
    return () => {
      console.log('Closing WebSocket connection.');
      socket.close();
    };
  }, [setBuses]); // useEffect depends on setBuses to conform to linting rules.
};

export default useBusSocket;