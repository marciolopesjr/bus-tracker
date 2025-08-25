import { useEffect } from 'react';

const useBusSocket = ({ setBuses, updateBusPosition }) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initial_positions') {
        setBuses(data.payload);
      } else if (data.type === 'position_update') {
        updateBusPosition(data.payload);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [setBuses, updateBusPosition]);
};

export default useBusSocket;
