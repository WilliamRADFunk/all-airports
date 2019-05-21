import { store } from "../constants/globalStore";

export function flushStore() {
	store.countries = {};
	store.countriesInList = [];
	store.countriesNotFound = [];
	store.failedCountries = [];
	store.govOffices = {};
	store.persons = {};
};