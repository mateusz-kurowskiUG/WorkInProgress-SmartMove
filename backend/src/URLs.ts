import URLSInterface from './interfaces/URLS.model';

const URLS: URLSInterface = {
  googleComputeRoute: 'https://routes.googleapis.com/directions/v2:computeRoutes',
  mevoStations: 'https://gbfs.urbansharing.com/rowermevo.pl/station_information.json',
  mevoStationsDetails: 'https://gbfs.urbansharing.com/rowermevo.pl/station_status.json',
  googleAutoComplete: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  googleFindPlace: 'https://maps.googleapis.com/maps/api/place/textsearch/json'
};

export default URLS;
