import { EntityContainer, entityMaker, entityRefMaker } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { airportDataList, isoCodeToDataCode } from '../utils/country-code-lookup-tables';
import { countryToId } from '../utils/country-to-id';

// Populate remaining airports from npm list
export function getAirportsFromNpm() {
    Object.values(airportDataList).forEach(ap => {
		// Fetch or create airport entity
		const airportId = consts.ONTOLOGY.INST_AIRPORT + getUuid(ap.iata);
		if (!airportId) {
			return; // No IATA code, no id. No id, no airport.
		}
		let airportObjectProp = {};
		if (!store.airports[airportId]) {
			airportObjectProp = entityMaker(
				consts.ONTOLOGY.HAS_AIRPORT,
				consts.ONTOLOGY.ONT_AIRPORT,
				airportId,
				`${ap.name || 'N/A'}`);
			store.airports[airportId] = airportObjectProp[consts.ONTOLOGY.HAS_AIRPORT];
		} else {
			return; // If already in system, it already has this source's data.
		}

		if (ap.name) {
			store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_NAME] = ap.name;
		}
		if (ap.iata) {
			store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_IATA_CODE] = ap.iata;
		}

		const lat = ap.lat;
		const lng = ap.lon;

		if (lat && lng) {
			const geoId = consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(ap.iata);
			let objectProp: EntityContainer = {};
			if (store.locations[geoId]) {
				objectProp[consts.ONTOLOGY.HAS_LOCATION] = store.locations[geoId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_LOCATION,
					consts.ONTOLOGY.ONT_GEO_LOCATION,
					geoId,
					`Geographic Location for ${ap.name || 'N/A'}`);
				store.locations[geoId] = objectProp[consts.ONTOLOGY.HAS_LOCATION];
				store.airports[airportId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, objectProp));
			}

			const locAttr = objectProp[consts.ONTOLOGY.HAS_LOCATION];
			const datatypeProp = {};
			if (locAttr && locAttr.datatypeProperties) {
				locAttr.datatypeProperties[consts.WGS84_POS.LAT] = Number(lat);
				locAttr.datatypeProperties[consts.WGS84_POS.LONG] = Number(lng);
				locAttr.datatypeProperties[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;
			} else {
				datatypeProp[consts.WGS84_POS.LAT] = Number(lat);
				datatypeProp[consts.WGS84_POS.LONG] = Number(lng);
				datatypeProp[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;
				locAttr.datatypeProperties = datatypeProp;
			}
		}

		const countryISO = ap.iso;
		const countryId = countryToId(isoCodeToDataCode(countryISO));
		// Associate Country
		if (countryISO) {
			store.airports[airportId].objectProperties.push(
				entityRefMaker(
					consts.ONTOLOGY.HAS_COUNTRY,
					store.countries,
					countryId
			));
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_AIRPORT, airportObjectProp));
		
			// Get relative size of airport (small, medium, large)
			if (ap.size) {
				store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_RELATIVE_SIZE] = ap.size;
			}
			// Get type of airport (heliport, military, seaplanes, closed)
			if (ap.type) {
				store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_TYPE] = ap.type;
			}
			// Get status of airport (open, closed)
			if (ap.status) {
				store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_STATUS] = ap.status ? 'Open' : 'Closed';
			}
		}
	});
}