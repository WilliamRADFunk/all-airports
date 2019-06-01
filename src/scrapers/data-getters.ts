import { getAirportsFromDatahub } from './airports-datahub';
import { getAirportsFromGeoJson } from './airports-geojson';
import { getRunwaysFromOurAirports } from './airports-oa-runways';
import { getAirportsFromNpm } from './airports-npm';

export const dataScrapers = {
	getAirportsFromDatahub,
	getAirportsFromGeoJson,
	getRunwaysFromOurAirports,
	getAirportsFromNpm
};
