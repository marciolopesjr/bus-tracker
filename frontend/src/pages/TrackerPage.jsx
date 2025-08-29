import BusMap from '../components/BusMap';
import useBusSocket from '../hooks/useBusSocket';
import BusInfoPanel from '../components/BusInfoPanel';

function TrackerPage() {
  useBusSocket();

  return (
    // O TrackerPage agora assume que está dentro de um contêiner
    <>
      <BusMap />
      <BusInfoPanel />
    </>
  );
}

export default TrackerPage;