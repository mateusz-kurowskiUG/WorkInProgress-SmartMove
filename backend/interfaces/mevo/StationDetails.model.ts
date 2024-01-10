import VehicleTypesInterface from "./VehicleTypes.model";

interface StationDetailsInterface {
  station_id: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  // last_reported: number;
  num_vehicles_available: number;
  num_bikes_available: number;
  num_docks_available: number;
  vehicle_types_available: VehicleTypesInterface[];
}
export default StationDetailsInterface;
