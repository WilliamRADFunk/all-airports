import { store } from "../constants/globalStore";

export function flushStore() {
	store.countries = {};
	store.countriesInList = [];
	store.airlinesNotFound = [];
	store.airportsNotFound = [];
	store.airportTable = {};
	store.failedAirlines = [];
	store.failedAirports = [];
	store.jsonLD = [];
	store.jsonNT = '';

	store.airports = {};
	store.airlines = {};
	store.countries = {};
	store.elevations = {};
	store.helicopterLandingZones = {};
	store.locations = {};
	store.runways = {};
	store.surfaceMaterials = {};
};