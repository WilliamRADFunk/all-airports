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

const correctionTable = {
    ye: 'ym',
    YE: 'ym',
    ru: 'rs',
    RU: 'rs',
    ua: 'up',
    UA: 'up',
    hn: 'ho',
    HN: 'ho',
    tr: 'tu',
    TR: 'tu',
    de: 'gm',
    DE: 'gm',
    sk: 'lo',
    SK: 'lo',
    cc: 'ck',
    CC: 'ck',
    ph: 'rp',
    PH: 'rp',
    ky: 'cj',
    KY: 'cj',
    vg: 'vi',
    VG: 'vi',
    bs: 'bf',
    BS: 'bf',
    cl: 'ci',
    CL: 'ci',
    mm: 'bm',
    MM: 'bm',
    dz: 'ag',
    DZ: 'ag',
    ie: 'ei',
    IE: 'ei',
    vu: 'nh',
    VU: 'nh',
    me: 'mj',
    ME: 'mj',
    zw: 'zi',
    ZW: 'zi',
    iq: 'iz',
    IQ: 'iz',
    jp: 'ja',
    JP: 'ja',
    pt: 'po',
    PT: 'po',
    aw: 'aa',
    AW: 'aa'
};

export function icaoCorrection(icao: string): string {
    return correctionTable[icao] || icao.toLowerCase();
}
