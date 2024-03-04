import VehicleTypesInterface from './VehicleTypes.model';

interface StationDetailsInterface {
  stationId: number;
  isInstalled: boolean;
  isRenting: boolean;
  // last_reported: number;
  numVehiclesAvailable: number;
  numBikesAvailable: number;
  numDocksAvailable: number;
  vehicleTypesAvailable: VehicleTypesInterface[];
}
export default StationDetailsInterface;
