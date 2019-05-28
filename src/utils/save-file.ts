import * as fj from 'formatter-json';
import * as fs from 'graceful-fs';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { FlatEntity } from '../models/flat-entity';

export function saveFile(fileName: string, storeName: string, context: string): void {
	store.debugLogger(`Saving ${storeName} in ${fileName}.json`);
	// Normal JSON file.
    let file = fj(JSON.stringify(store[storeName]));
	store.debugLogger(`Stringified ${storeName} to json`);
	file = file.replace(/\\n/g, ' ');
	store.debugLogger(`Removed line breaks in ${storeName}`);
	fs.writeFileSync(`dist/json/${fileName}.json`, file);
	store.debugLogger(`Saved ${storeName} in ${fileName}.json`);
	// JSON-LD file construction.
	const jsonLD: FlatEntity[] = [];
	// const jsonLD = {
	// 	'@context': context,
	// 	'@graph': []
	// };
	store.debugLogger(`Saving ${storeName} in ${fileName}.schema.jsonld`);
	Object.keys(store[storeName]).forEach(key1 => {
		// Grab the basic @id, @type, and rdfs label
		const mainObj = {
			'@id': store[storeName][key1]['@id'],
			'@type': store[storeName][key1]['@type'],
			'http://www.w3.org/2000/01/rdf-schema#label': store[storeName][key1][consts.RDFS.label]
		};
		// Pull datatype properties out of their singleton object and make them direct props.
		const dataProps = store[storeName][key1].datatypeProperties;
		Object.keys(dataProps).forEach(key2 => {
			mainObj[key2] = dataProps[key2];
		});
		// Pull out object properties, and make them direct properties but with array groups for multiples.
		const objectProps = store[storeName][key1].objectProperties;
		objectProps.forEach(objP => {
			// Should be one key per object
			const key = Object.keys(objP)[0];
			if (mainObj[key]) {
				if (Array.isArray(mainObj[key])) {
					mainObj[key].push(objP[key]);
				} else {
					mainObj[key] = [mainObj[key], objP[key]];
				}
			} else {
				mainObj[key] = objP[key];
			}
		})
		// Add it to the graph that belongs to this entity type.
		// jsonLD['@graph'].push(mainObj);
		jsonLD.push(mainObj);
		store[storeName][key1] = null;
	});

    let fileLD = fj(JSON.stringify(jsonLD));
	fileLD = fileLD.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/jsonld/${fileName}.schema.jsonld`, fileLD);
	store.debugLogger(`Saved ${storeName} in ${fileName}.schema.jsonld`);
};
