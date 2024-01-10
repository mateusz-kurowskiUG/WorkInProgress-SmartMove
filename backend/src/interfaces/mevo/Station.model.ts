import CordsInterface from "./Cords.model";

interface StationInterface {
  station_id: number;
  name: string;
  address: string;
  cross_street: string;
  lat: number;
  lon: number;
  is_virtual_station: boolean;
  capacity: number;
  status: number;
  stationArea: CordsInterface[];
}
export default StationInterface;
