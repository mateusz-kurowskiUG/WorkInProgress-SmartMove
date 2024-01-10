import CordsInterface from './Cords.model';

interface StationInterface {
  stationId: number;
  name: string;
  address: string;
  crossStreet: string;
  lat: number;
  lon: number;
  isVirtualStation: boolean;
  capacity: number;
  stationArea: CordsInterface[];
}
export default StationInterface;
