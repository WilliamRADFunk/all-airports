import { dataScrapers } from './scrapers/data-getters';
import { createLookupTable } from './utils/country-code-lookup-tables';
import { getCountries } from './utils/get-countries';
import { loadFiles } from './utils/load-files';
import { saveFiles } from './utils/save-files';

(async () => {
    loadFiles();
    await getCountries();
    createLookupTable();
    dataScrapers.getAirportsFromGeoJson();
    dataScrapers.getAirportsFromNpm();
    dataScrapers.getAirportsFromDatahub();
    dataScrapers.getRunwaysFromOurAirports();
    saveFiles();
})();