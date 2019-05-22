import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('countries', 'countries', consts.ONTOLOGY.ONT_COUNTRY);
	saveFile('airports', 'airports', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('airlines', 'airlines', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('locations', 'locations', consts.ONTOLOGY.ONT_GEO_LOCATION);
};