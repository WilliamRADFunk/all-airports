
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { EntityContainer } from '../models/entity-container';
import { countryToId } from '../utils/country-to-id';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

import * as airportDataLocal from '../assets/airports-source.json';

export function getAirportsFromGeoJson() {
	Object.values(airportDataLocal.features).forEach(ap => {
		const airportProps = ap.properties;
		const airportLocation = ap.geometry.coordinates;


		store.debugLogger(`Airport, ${airportProps.name}, ${airportProps.gps_code}`);
		store.debugLogger(`Airport Location, ${airportLocation[1]}, ${airportLocation[0]}`);

		// Fetch or create airport entity
		const airportId = consts.ONTOLOGY.INST_AIRPORT + getUuid(airportProps.gps_code || '');
		store.debugLogger(`Airport ID, ${airportId}`);

		if (!airportId) {
			return; // No ICAO code, no id. No id, no airport.
		}

		let airportObjectProp = {};
		if (!!store.airports[airportId]) {
			airportObjectProp[consts.ONTOLOGY.HAS_AIRPORT] = store.airports[airportId];
		} else {
			airportObjectProp = entityMaker(
				consts.ONTOLOGY.HAS_AIRPORT,
				consts.ONTOLOGY.ONT_AIRPORT,
				airportId,
				`${airportProps.name}`);
			store.airports[airportId] = airportObjectProp[consts.ONTOLOGY.HAS_AIRPORT];
		}
		store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_NAME] = airportProps.name;
		store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_ICAO_CODE] = airportProps.gps_code;
		store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_IATA_CODE] = airportProps.iata_code;
		store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_WIKI_URI] = airportProps.wikipedia;

		const geoId = consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(airportProps.gps_code || '');
		let objectProp: EntityContainer = {};
		if (store.locations[geoId]) {
			objectProp[consts.ONTOLOGY.HAS_LOCATION] = store.locations[geoId];
		} else {
			objectProp = entityMaker(
				consts.ONTOLOGY.HAS_LOCATION,
				consts.ONTOLOGY.ONT_GEO_LOCATION,
				geoId,
				`Geographic Location for ${airportProps.name}`);
			store.locations[geoId] = objectProp[consts.ONTOLOGY.HAS_LOCATION];
		}
		const locAttr = objectProp[consts.ONTOLOGY.HAS_LOCATION];
		store.airports[airportId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, objectProp));

		const datatypeProp = {};
		if (locAttr && locAttr.datatypeProperties) {
			locAttr.datatypeProperties[consts.WGS84_POS.LAT] = airportLocation[1];
			locAttr.datatypeProperties[consts.WGS84_POS.LONG] = airportLocation[0];
			locAttr.datatypeProperties[consts.WGS84_POS.LAT_LONG] = `${airportLocation[1]}, ${airportLocation[0]}`;
		} else {
			datatypeProp[consts.WGS84_POS.LAT] = airportLocation[1];
			datatypeProp[consts.WGS84_POS.LONG] = airportLocation[0];
			datatypeProp[consts.WGS84_POS.LAT_LONG] = `${airportLocation[1]}, ${airportLocation[0]}`;
			locAttr.datatypeProperties = datatypeProp;
		}

		const airportSourceObject = store.airportTable[airportProps.iata_code || ''];
		const countryISO = airportSourceObject && airportSourceObject.iso;
		// Associate Country
		if (countryISO) {
			const countryId = countryToId(countryISO.toLowerCase());
			store.debugLogger(`---- ${store.countries[countryId]} -----`);
			store.airports[airportId].objectProperties.push(
				entityRefMaker(
					consts.ONTOLOGY.HAS_COUNTRY,
					store.countries,
					countryId
			));
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_AIRPORT, airportObjectProp));
		}
	})
};