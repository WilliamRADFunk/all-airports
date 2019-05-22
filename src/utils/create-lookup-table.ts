import { store } from '../constants/globalStore';
import { AirportSourceObject } from '../models/airport-source-object';

import * as airportDataNpm from '../assets/airports-npm.json';

export function createLookupTable(): void {
    airportDataNpm.forEach(ap => {
        if (ap && ap.iata && ap.iso) {
            store.airportTable[ap.iata] = ap as AirportSourceObject;
        }
    });
};
