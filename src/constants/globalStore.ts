import { AirportSourceObject } from "../models/airport-source-object";
import { CountryReference } from "../models/country-reference";
import { EntityListWrapper } from "../models/entity-list-wrapper";
import { consoleError, consoleLog } from "../utils/logger";

// const noop = () => { /* Noop */ };
const noop = (a, b) => { consoleLog(`${a} is ${Math.floor(b * 100)} done`) };

class GlobalStore {
	public LOG_FILE_NAME: string = '';
	public LOG_STREAM: any = null;
	public countriesInList: CountryReference[] = [];
	public debugLogger: any = consoleLog;
	public errorLogger: any = consoleError;
	public progressLogger: any = noop;

	public airlinesNotFound: string[] = [];
	public airportsNotFound: string[] = [];
	public airportTable: { [key: string]: AirportSourceObject } = {};
	public failedAirlines: string[] = [];
	public failedAirports: string[] = [];

	public airports: EntityListWrapper = {};
	public airlines: EntityListWrapper = {};
	public countries: EntityListWrapper = {};
	public locations: EntityListWrapper = {};
}

export const store = new GlobalStore();