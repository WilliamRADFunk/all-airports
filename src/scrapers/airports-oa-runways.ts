import { csv } from 'csv-parse';
import { Entity, EntityContainer, entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { AirportProperties } from '../models/airport-properties';
import { RunwayOurairportsSourceObject } from '../models/runway-ourairports-source-object';
import { isoCodeToDataCode } from '../utils/country-code-lookup-tables';
import { countryToId } from '../utils/country-to-id';

const materialLookupTable: { [key: string]: string } = {
    'ASPH': 'Asphalt',
    'ASP': 'Asphalt',
    'ASPHALT': 'Asphalt',
    'BIT': 'Bituminous asphalt or tarmac',
    'BRI': 'Bricks',
    'CLA': 'Clay',
    'CON': 'Concrete',
    'CONC': 'Concrete',
    'COR': 'Coral (fine crushed coral reef structures)',
    'DIRT': 'Dirt',
    'GRASS': 'Grass',
    'GRAVEL': 'Gravel',
    'GRE': 'Graded or rolled earth/grass',
    'GRS': 'Grass',
    'GRVL': 'Gravel',
    'GVL': 'Gravel',
    'ICE': 'Ice',
    'LANDING MATS': 'Marston Matting',
    'LAT': 'Laterite',
    'MAC': 'Macadam',
    'MAT': 'Marston Matting',
    'MATS': 'Marston Matting',
    'MEMBRANES': 'Marston Matting',
    'NATURAL SOIL': 'Natural Soil',
    'PEM': 'Partially concrete, asphalt or bitumen-bound macadam',
    'PER': 'Permanent surface, details unknown',
    'PIERCED STEEL PLANKING': 'Marston Matting',
    'PSP': 'Marston Matting',
    'ROOF': 'Rooftop',
    'ROOF-TOP': 'Rooftop',
    'SAN': 'Sand',
    'SMT': 'Sommerfeld Tracking',
    'SNO': 'Snow',
    'SOD': 'Sod',
    'TREATED': 'Treated',
    'TRTD': 'Treated',
    'TURF': 'Turf',
    'WATER': 'Water',
    'WOOD': 'Wood',
    'U': 'Unknown'
};
const conditionLookupTable = {
    'P': 'Poor',
    'p': 'Poor',
    'F': 'Fair',
    'f': 'Fair',
    'G': 'Good',
    'g': 'Good'
};

const csvObject = csv({
  delimiter: ','
});

export function getRunwaysFromOurAirports(): void {
    const runwayData: Array<RunwayOurairportsSourceObject> = [];

    let fileData: string;
    // If file exists, great. Otherwise make a blank one for later.
    try {
        fileData = fs.readFileSync(`../assets/runways-ourairports.csv`) as any as string;
    } catch (err) {
        fileData = '';
    }

    csvObject(fileData).to.array(data => {
        data.forEach(datum => runwayData.push(CSV(datum[0], datum[1], datum[2], datum[3], datum[4], datum[5], datum[6], datum[7])));
    });
    
	Object.values(runwayData).forEach(runway => {
        const airportId = consts.ONTOLOGY.INST_AIRPORT + getUuid(runway.ident);
        const airport = store.airports[airportId];
        // If an airport doesn't already exist in the store for this runway,
        // we can't attach the runway to anything.
        if (airport && runway.length && runway.width) {
            const runwayObjProperties = airport.objectProperties;
            let runMap = getRelation(runwayObjProperties, consts.ONTOLOGY.HAS_RUNWAY);
            const rId = consts.ONTOLOGY.INST_RUNWAY + getUuid(runway.ident);
            if (!runMap) {
                let objectProp: EntityContainer = {};
                if (store.runways[rId]) {
                    objectProp[consts.ONTOLOGY.HAS_RUNWAY] = store.runways[rId];
                } else {
                    objectProp = entityMaker(
                        consts.ONTOLOGY.HAS_RUNWAY,
                        consts.ONTOLOGY.ONT_RUNWAY,
                        rId,
                        `Runway for ${airport.name || runway.ident}`);
                    store.runways[rId] = objectProp[consts.ONTOLOGY.HAS_RUNWAY];
                }
                runMap = objectProp[consts.ONTOLOGY.HAS_RUNWAY];
                airport.objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_RUNWAY, objectProp));
            }
            runMap.datatypeProperties[consts.ONTOLOGY.DT_LENGTH] = Number(runway.length);
            runMap.datatypeProperties[consts.ONTOLOGY.DT_WIDTH] =  Number(runway.width);
            runMap.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'ft';
            
            if (runway.surfMat) {
                // Catches edge case where single letters specifiy condition of the runway material.
                const hyphenList = runway.surfMat.split('-').map(sm => sm.trim());
                const hasCondition = (hyphenList[1] && hyphenList[1].length === 1) || null;
                let condition = '';
                if (hasCondition) {
                    condition = conditionLookupTable[hyphenList[1]];
                }

                // Ensure synonyms of same material aren't counted as extra
                const surfaceMaterials: string[] = runway.surfMat.split(/-|\//).map(sm => sm.trim()) || [];
                let convertedSurList: string[] = []; 
                if (!hasCondition) {
                    surfaceMaterials.forEach(mat => {
                        convertedSurList.push(materialLookup(mat));
                    });
                    // Remove undefined, and duplications
                    const fistSurf = convertedSurList[0];
                    convertedSurList = convertedSurList.slice(1).filter(x => !!x).filter(x => x !== fistSurf);
                }

                if (!convertedSurList[0]) {
                    return;
                }
                
                if (materialLookup(convertedSurList[0]) === 'ROOF' || convertedSurList.length === 1) {
                    makeSurfaceMaterial(airport, runMap, runway.ident, materialLookup(runway.surfMat), false, condition);
                } else {
                    convertedSurList.forEach(mat => {
                        makeSurfaceMaterial(airport, runMap, runway.ident, mat, true);
                    });
                }
            }
        }
	});
};

function makeSurfaceMaterial(
    airport: Entity,
    runMap: Entity,
    runwayId: string,
    sMat: string,
    isComposite: boolean,
    condition?: string
) {
    const runwayObjProperties = runMap.objectProperties;
    let mapSurfMat = getRelation(runwayObjProperties, consts.ONTOLOGY.HAS_SURFACE_MATERIAL);
    const smId = consts.ONTOLOGY.INST_SURFACE_MATERIAL + getUuid(runwayId) + getUuid(sMat);
    if (!mapSurfMat) {
        let surfMatObjProp: EntityContainer = {};
        if (store.surfaceMaterials[smId]) {
            surfMatObjProp[consts.ONTOLOGY.HAS_SURFACE_MATERIAL] = store.surfaceMaterials[smId];
        } else {
            surfMatObjProp = entityMaker(
                consts.ONTOLOGY.HAS_SURFACE_MATERIAL,
                consts.ONTOLOGY.ONT_SURFACE_MATERIAL,
                smId,
                `Surface Material for the runway at ${airport.name || runwayId}`);
            store.surfaceMaterials[smId] = surfMatObjProp[consts.ONTOLOGY.HAS_SURFACE_MATERIAL];
        }
        mapSurfMat = surfMatObjProp[consts.ONTOLOGY.HAS_SURFACE_MATERIAL];
        mapSurfMat.objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_SURFACE_MATERIAL, surfMatObjProp));
    }
    if (condition) {
        mapSurfMat.datatypeProperties[consts.ONTOLOGY.DT_CONDITION] = condition;
    }
    mapSurfMat.datatypeProperties[consts.ONTOLOGY.DT_IS_COMPOSITE] = isComposite;
    mapSurfMat.datatypeProperties[consts.ONTOLOGY.DT_MATERIAL] = sMat;
}

function materialLookup(abbrev: string): string {
    return materialLookupTable[(abbrev || '').toUpperCase()];
}

function CSV(
    id: number,
    refId: number,
    ident: string,
    length: number,
    width: number,
    surfMat: string,
    lighted: number,
    closed: number
) {
    return {
        closed: !!closed,
        id,
        ident,
        length,
        lighted: !!lighted,
        refId,
        surfMat,
        width
    };
}; 