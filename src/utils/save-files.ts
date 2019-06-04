import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('countries', 'countries', consts.ONTOLOGY.ONT_COUNTRY);
	saveFile('runways', 'runways', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('surfaceMaterials', 'surfaceMaterials', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('helicopterLandingZones', 'helicopterLandingZones', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('airports', 'airports', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('airlines', 'airlines', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('elevations', 'elevations', consts.ONTOLOGY.ONT_ELEVATION);
	saveFile('locations', 'locations', consts.ONTOLOGY.ONT_GEO_LOCATION);
	saveFile('municipalities', 'municipalities', consts.ONTOLOGY.ONT_MUNICIPALITY);
};