import { Loader } from '@googlemaps/js-api-loader';
const loader: Loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_KEY || '',
  version: 'weekly'
});

export default loader;
