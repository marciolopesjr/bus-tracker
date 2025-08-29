import Sidebar from '../components/Sidebar';
import BusMap from '../components/BusMap';
import useBusSocket from '../hooks/useBusSocket';

function TrackerPage() {
  // Activate the WebSocket connection for this view.
  // The hook itself handles all the logic of listening for messages
  // and updating the global state.
  useBusSocket();

  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <main className="flex-1">
        <BusMap />
      </main>
    </div>
  );
}

export default TrackerPage;