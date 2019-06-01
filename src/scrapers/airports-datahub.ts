import { Entity, EntityContainer, entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { AirportDatahubSourceObject } from '../models/airport-datahub-source-object';
import { airportDatahubList, isoCodeToDataCode } from '../utils/country-code-lookup-tables';
import { countryToId } from '../utils/country-to-id';

// Populate remaining airports from datahub list
export function getAirportsFromDatahub() {
    airportDatahubList.forEach(ap => {
		const countryISO = ap.iso_country;
		const countryId = countryToId(isoCodeToDataCode(countryISO));

		// Deleted name means it's not a legit airport. Skip it.
		if (ap.name.toLowerCase() === 'delete' || ap.name === 'marked as spam') {
			return;
		}
		// If airport was built from previous files, only update potentially empty fields.
		const existingId = ap.iata_code && consts.ONTOLOGY.INST_AIRPORT + getUuid(ap.iata_code);
		const existingAirport = store.airports[existingId]
		if (ap.iata_code && existingAirport) {
			if (!existingAirport.datatypeProperties[consts.ONTOLOGY.DT_ICAO_CODE] && ap.gps_code) {
				store.airports[existingId].datatypeProperties[consts.ONTOLOGY.DT_ICAO_CODE] = ap.gps_code;
			}
			if (!existingAirport.datatypeProperties[consts.ONTOLOGY.DT_NAME] && ap.name) {
				store.airports[existingId].datatypeProperties[consts.ONTOLOGY.DT_NAME] = ap.name;
			}
			if (!existingAirport.datatypeProperties[consts.ONTOLOGY.DT_REGION_ISO_CODE] && ap.iso_region) {
				store.airports[existingId].datatypeProperties[consts.ONTOLOGY.DT_REGION_ISO_CODE] = ap.iso_region;
			}
			if (ap.elevation_ft) {
				makeElevation(existingAirport, ap);
			}
			if (ap.municipality) {
				makeMunicipality(existingAirport, ap, store.countries[countryId]);
			}
			return;
		}
		// Fetch or create airport entity
		const airportId = consts.ONTOLOGY.INST_AIRPORT + getUuid(ap.ident);
		if (!airportId) {
			return; // No ident, no id. No id, no airport.
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
		if (ap.gps_code) {
			store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_ICAO_CODE] = ap.gps_code;
		}
		if (ap.iata_code) {
			store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_IATA_CODE] = ap.iata_code;
		}
		if (ap.iso_region) {
			store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_REGION_ISO_CODE] = ap.iso_region;
		}

		const coords = ap.coordinates && ap.coordinates.split(',').map(c => c.trim());
		let lat;
		let lng;
		if (coords.length) {
			lng = Number(coords[0]);
			lat = Number(coords[1]);
		}

		if (lat && lng) {
			const geoId = consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(ap.ident);
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

		// Extract Elevation
		if (ap.elevation_ft) {
			makeElevation(store.airports[airportId], ap);
		}

		// Associate Country
		if (countryId) {
			store.airports[airportId].objectProperties.push(
				entityRefMaker(
					consts.ONTOLOGY.HAS_COUNTRY,
					store.countries,
					countryId
			));
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_AIRPORT, airportObjectProp));
		
			// Get relative size of airport (small, medium, large)
			if (ap.type && ap.type.indexOf('_airport') > 0) {
				store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_RELATIVE_SIZE] = ap.type.split('_')[0];
			}
			// Get type of airport (heliport, military, seaplanes, closed)
			if (ap.type) {
				const airport = ap.type.split('_')[1];
				store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_TYPE] = airport ? airport : ap.type;
			}
			// Get status of airport (open, closed)
			if (ap.type && ap.type.toLowerCase() === 'closed') {
				store.airports[airportId].datatypeProperties[consts.ONTOLOGY.DT_STATUS] = 'Closed';
			}
		}
		
		// Extract Municipality
		if (ap.municipality) {
			makeMunicipality(store.airports[airportId], ap, store.countries[countryId]);
		}
	});
}

function makeElevation(airport: Entity, apToScrape: AirportDatahubSourceObject) {
	const objectProperties = airport.objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_ELEVATION);
	const eId = consts.ONTOLOGY.INST_ELEVATION + getUuid(apToScrape.ident);
	if (!map) {
		let objectProp: EntityContainer = {};
		if (store.elevations[eId]) {
			objectProp[consts.ONTOLOGY.HAS_ELEVATION] = store.elevations[eId];
		} else {
			objectProp = entityMaker(
				consts.ONTOLOGY.HAS_ELEVATION,
				consts.ONTOLOGY.ONT_ELEVATION,
				eId,
				`Elevation for ${airport.name || apToScrape.name || apToScrape.ident}`);
			store.elevations[eId] = objectProp[consts.ONTOLOGY.HAS_ELEVATION];
		}
		map = objectProp[consts.ONTOLOGY.HAS_ELEVATION];
		airport.objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_ELEVATION, objectProp));
	}
	map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT] = Number(apToScrape.elevation_ft);
	map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT_DESCRIPTION] = 'The highest point of the airport\'s useable runway system measured in feet above mean sea level';
	map.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'ft';
}

function makeMunicipality(airport: Entity, apToScrape: AirportDatahubSourceObject, country?: Entity) {
	const objectProperties = airport.objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_MUNICIPALITY);
	const mId = consts.ONTOLOGY.INST_MUNICIPALITY + getUuid(apToScrape.ident);
	if (!map) {
		let objectProp: EntityContainer = {};
		if (store.municipalities[mId]) {
			objectProp[consts.ONTOLOGY.HAS_MUNICIPALITY] = store.municipalities[mId];
		} else {
			objectProp = entityMaker(
				consts.ONTOLOGY.HAS_MUNICIPALITY,
				consts.ONTOLOGY.ONT_MUNICIPALITY,
				mId,
				`Municipality of ${airport.municipality || apToScrape.municipality}`);
			store.municipalities[mId] = objectProp[consts.ONTOLOGY.HAS_MUNICIPALITY];
		}
		map = objectProp[consts.ONTOLOGY.HAS_MUNICIPALITY];
		map.objectProperties.push(
			entityRefMaker(
				consts.ONTOLOGY.HAS_AIRPORT,
				store.airports,
				airport['@id']
		));
		airport.objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_MUNICIPALITY, objectProp));
		map.datatypeProperties[consts.ONTOLOGY.DT_NAME] = apToScrape.municipality;
		if (country) {
			country.objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_MUNICIPALITY, objectProp));
			map.objectProperties.push(
				entityRefMaker(
					consts.ONTOLOGY.HAS_COUNTRY,
					store.countries,
					country['@id']
			));
		}
	}
}