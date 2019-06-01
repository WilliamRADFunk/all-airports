import { CountryReference, EntityListWrapper, FlatEntity } from "funktologies";
import { AirportNpmSourceObject } from "../models/airport-npm-source-object";
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
	public airportTable: { [key: string]: AirportNpmSourceObject } = {};
	public failedAirlines: string[] = [];
	public failedAirports: string[] = [];
	public jsonLD: FlatEntity[] = [];
	public jsonNT: string = '';

	public airports: EntityListWrapper = {};
	public airlines: EntityListWrapper = {};
	public countries: EntityListWrapper = {};
	public elevations: EntityListWrapper = {};
	public locations: EntityListWrapper = {};
	public municipalities: EntityListWrapper = {};
	public runways: EntityListWrapper = {};
	public surfaceMaterials: EntityListWrapper = {};
}

export const store = new GlobalStore();