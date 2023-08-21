import { Loader } from '@googlemaps/js-api-loader';
import { MAPS_KEY } from '../constants/constants';

const mapsLoader = new Loader({
    apiKey: MAPS_KEY,
    version: 'weekly',
    libraries: ['places'],
});
export default mapsLoader;