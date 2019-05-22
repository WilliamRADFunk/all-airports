import { dataScrapers } from './scrapers/data-getters';
import { getCountries } from './utils/get-countries';
import { loadFiles } from './utils/load-files';
import { saveFiles } from './utils/save-files';

loadFiles();

(async () => {
    await getCountries();
})();

dataScrapers.getAirportsFromGeoJson();

saveFiles();