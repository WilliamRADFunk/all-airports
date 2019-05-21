const MAIN_INSTANCE_PATH = 'http://williamrobertfunk.com/instance/';
const COUNTRY_ONT_PATH = 'http://williamrobertfunk.com/ontologies/world-factbook#';
const MAIN_ONT_PATH = 'http://williamrobertfunk.com/ontologies/world-leaders#';
const FOAF_ONT_PATH = 'http://xmlns.com/foaf/0.1/';

const BASE = {
	COUNTRY_BLACKLIST: [
		"please select a country to view",
		"world"
	],
	DATA_REQUEST_TIMEOUT: 40000,
	URL_BASE: 'https://www.cia.gov/library/publications/the-world-factbook/',
	URL_LEADER_BASE: 'https://www.cia.gov/library/publications/resources/world-leaders-1/'
};

const ONTOLOGY = {
	// Ontology definition paths for (predicate) datatype properties
	DT_FIRST_NAME: FOAF_ONT_PATH + 'firstName',
	DT_ISO_CODE: COUNTRY_ONT_PATH + 'countryCodeISO',
	DT_LAST_NAME: FOAF_ONT_PATH + 'lastName',
	DT_NAME: FOAF_ONT_PATH + 'name',
	DT_REGION_SPECIFIC: MAIN_ONT_PATH + 'regionSpecific',
	DT_TITLE: MAIN_ONT_PATH + 'title',
	// Ontology definition paths for (predicate) object/relation properties
	HAS_APPOINTED_GOVERNMENT_OFFICE: MAIN_ONT_PATH + 'appointedGovernmentOffice',
	HAS_COUNTRY: COUNTRY_ONT_PATH + 'hasCountry',
	HAS_GOVERNMENT_OFFICE: MAIN_ONT_PATH + 'hasGovernmentOffice',
	HAS_GOVERNMENT_OFFICIAL: MAIN_ONT_PATH + 'hasGovernmentOfficial',
	// Instance definition paths
	INST_COUNTRY: MAIN_INSTANCE_PATH + 'Country/',
	INST_GOVERNMENT_OFFICE: MAIN_INSTANCE_PATH + 'GovernmentOffice/',
	INST_PERSON: MAIN_INSTANCE_PATH + 'Person/',
	// Base path for all things instance definition
	MAIN_INSTANCE_PATH,
	// Base path for all things ontology definition
	MAIN_ONT_PATH,
	// Ontology class definition paths
	ONT_COUNTRY: COUNTRY_ONT_PATH + 'Country',
	ONT_GOVERNMENT_OFFICE: MAIN_ONT_PATH + 'GovernmentOffice',
	ONT_PERSON: MAIN_ONT_PATH + 'Person',
};

const RDFS = {
	label: 'http://www.w3.org/2000/01/rdf-schema#label'
};
class Constants {
	public BASE = BASE;
	public ONTOLOGY = ONTOLOGY;
	public RDFS = RDFS;
};

export const consts = new Constants();