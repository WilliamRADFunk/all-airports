import { CountryReference } from "../models/country-reference";
import { EntityListWrapper } from "../models/entity-list-wrapper";
import { consoleError, consoleLog } from "../utils/logger";

// const noop = () => { /* Noop */ };
const noop = (a, b) => { consoleLog(`${a} is ${Math.floor(b * 100)} done`) };

class GlobalStore {
	public LOG_FILE_NAME: string = '';
	public LOG_STREAM: any = null;
	public countriesInList: CountryReference[] = [];
	public countriesNotFound: string[] = [];
	public debugLogger: any = consoleLog;
	public errorLogger: any = consoleError;
	public progressLogger: any = noop;
	public failedCountries: CountryReference[] = [];

	public countries: EntityListWrapper = {};
	public govOffices: EntityListWrapper = {};
	public persons: EntityListWrapper = {};
}

export const store = new GlobalStore();