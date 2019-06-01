const MAIN_INSTANCE_PATH = 'http://williamrobertfunk.com/instance/';
const COUNTRY_ONT_PATH = 'http://williamrobertfunk.com/ontologies/country#';
const GENERAL_ONT_PATH = 'http://williamrobertfunk.com/ontologies/general#';
const AIRPORT_ONT_PATH = 'http://williamrobertfunk.com/ontologies/airport#';
const MUNICIPALITY_ONT_PATH = 'http://williamrobertfunk.com/ontologies/municipality#';
const GEO_ONT_PATH = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
const FOAF_ONT_PATH = 'http://xmlns.com/foaf/0.1/';
const WGS84_POS = {
	ALT: GEO_ONT_PATH + 'alt',
	LAT: GEO_ONT_PATH + 'lat',
	LAT_LONG: GEO_ONT_PATH + 'lat_long',
	LOCATION: GEO_ONT_PATH + 'location',
	LONG: GEO_ONT_PATH + 'long',
	POINT: GEO_ONT_PATH + 'Point',
	SPATIAL_THING: GEO_ONT_PATH + 'SpatialThing'
};

const BASE = {
	COUNTRY_BLACKLIST: [
		"please select a country to view",
		"world"
	],
	DATA_REQUEST_TIMEOUT: 40000
};

const ONTOLOGY = {
	// Ontology definition paths for (predicate) datatype properties
	DT_CONDITION: GENERAL_ONT_PATH + 'condition',
	DT_GEC_CODE: COUNTRY_ONT_PATH + 'countryCodeGEC',
	DT_HIGHEST_POINT: GENERAL_ONT_PATH + 'highestPoint',
	DT_HIGHEST_POINT_DESCRIPTION: GENERAL_ONT_PATH + 'highestPointDescription',
	DT_IATA_CODE: AIRPORT_ONT_PATH + 'iataCode',
	DT_ICAO_CODE: AIRPORT_ONT_PATH + 'icaoCode',
	DT_IS_COMPOSITE: GENERAL_ONT_PATH + 'isComposite',
	DT_ISO_CODE: COUNTRY_ONT_PATH + 'countryCodeISO',
	DT_LENGTH: GENERAL_ONT_PATH + 'length',
	DT_MATERIAL: GENERAL_ONT_PATH + 'material',
	DT_NAME: FOAF_ONT_PATH + 'name',
	DT_REGION_ISO_CODE: COUNTRY_ONT_PATH + 'regionCodeISO',
	DT_RELATIVE_SIZE: AIRPORT_ONT_PATH + 'relativeSize',
	DT_STATUS: AIRPORT_ONT_PATH + 'status',
	DT_TYPE: AIRPORT_ONT_PATH + 'type',
	DT_UNIT: GENERAL_ONT_PATH + 'unit',
	DT_WIDTH: GENERAL_ONT_PATH + 'width',
	DT_WIKI_URI: GENERAL_ONT_PATH + 'wikiURI',
	// Ontology definition paths for (predicate) object/relation properties
	HAS_AIRPORT: AIRPORT_ONT_PATH + 'hasAirport',
	HAS_COUNTRY: COUNTRY_ONT_PATH + 'hasCountry',
	HAS_ELEVATION: GENERAL_ONT_PATH + 'hasElevation',
	HAS_LOCATION: GENERAL_ONT_PATH + 'hasLocation',
	HAS_MUNICIPALITY: MUNICIPALITY_ONT_PATH + 'hasMunicipality',
	HAS_RUNWAY: AIRPORT_ONT_PATH + 'hasRunway',
	HAS_SURFACE_MATERIAL: AIRPORT_ONT_PATH + 'hasSurfaceMaterial',
	// Instance definition paths
	INST_AIRLINE: MAIN_INSTANCE_PATH + 'Airline/',
	INST_AIRPORT: MAIN_INSTANCE_PATH + 'Airport/',
	INST_COUNTRY: MAIN_INSTANCE_PATH + 'Country/',
	INST_ELEVATION: MAIN_INSTANCE_PATH + 'Elevation/',
	INST_GEO_LOCATION: MAIN_INSTANCE_PATH + 'Location/',
	INST_MUNICIPALITY: MAIN_INSTANCE_PATH + 'Municipality/',
	INST_RUNWAY: MAIN_INSTANCE_PATH + 'Runway/',
	INST_SURFACE_MATERIAL: MAIN_INSTANCE_PATH + 'SurfaceMaterial',
	// Base path for all things instance definition
	MAIN_INSTANCE_PATH,
	// Base path for all things ontology definition
	MAIN_ONT_PATH: AIRPORT_ONT_PATH,
	// Ontology class definition paths
	ONT_AIRLINE: AIRPORT_ONT_PATH + 'Airline',
	ONT_AIRPORT: AIRPORT_ONT_PATH + 'Airport',
	ONT_COUNTRY: COUNTRY_ONT_PATH + 'Country',
	ONT_ELEVATION: GENERAL_ONT_PATH + 'Elevation',
	ONT_GEO_LOCATION: GENERAL_ONT_PATH + 'Location',
	ONT_MUNICIPALITY: MUNICIPALITY_ONT_PATH + 'Municipality',
	ONT_RUNWAY: AIRPORT_ONT_PATH + 'Runway',
	ONT_SURFACE_MATERIAL: AIRPORT_ONT_PATH + 'SurfaceMaterial'
};

const RDFS = {
	label: 'http://www.w3.org/2000/01/rdf-schema#label'
};
class Constants {
	public BASE = BASE;
	public ONTOLOGY = ONTOLOGY;
	public RDFS = RDFS;
	public WGS84_POS = WGS84_POS;
};

export const consts = new Constants();