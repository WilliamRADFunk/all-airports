import { Entity, EntityContainer, entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getHelicopterLandingZones() {
    Object.values(store.airports).forEach(airport => {
        let location: Entity = getRelation(airport.objectProperties, consts.ONTOLOGY.HAS_LOCATION);
        location = store.locations[location && location['@id']];
        let runway: Entity = getRelation(airport.objectProperties, consts.ONTOLOGY.HAS_RUNWAY);
        runway = store.runways[runway && runway['@id']];
        // No location, no way to land on the spot.
        // No runway, no place to get length, width, and surface materials from.
        if (!location || !runway) {
            return;
        }

        const surfaceMats: Entity[] = airport.objectProperties
            .filter(x => x[consts.ONTOLOGY.HAS_SURFACE_MATERIAL])
            .map(y => y[consts.ONTOLOGY.HAS_SURFACE_MATERIAL])
            .map(z => store.surfaceMaterials[z && z['@id']]);

        const latLng = location.datatypeProperties[consts.WGS84_POS.LAT_LONG];
        const length =  runway.datatypeProperties[consts.ONTOLOGY.DT_LENGTH];
        const width =  runway.datatypeProperties[consts.ONTOLOGY.DT_WIDTH];
        const unit =  runway.datatypeProperties[consts.ONTOLOGY.DT_UNIT];
        // Without a location, a width, a length, and a minimum size (80 ft width),
        // There is nothing to make a Helicopter Landing Zone out of.
        if (!latLng || !length || !width || !Math.floor(width / 80)) {
            return;
        }

        const hlzId = consts.ONTOLOGY.INST_HELO_LAND_ZONE + getUuid(latLng);
        let objectProp: EntityContainer = {};

        if (!store.helicopterLandingZones[hlzId]) {
            objectProp = entityMaker(
                consts.ONTOLOGY.HAS_HELO_LAND_ZONE,
                consts.ONTOLOGY.ONT_HELO_LAND_ZONE,
                hlzId,
                `Helicopter Landing Zone on runway of airport: ${
                    airport.datatypeProperties[consts.ONTOLOGY.DT_NAME] ||
                    airport.datatypeProperties[consts.ONTOLOGY.DT_ICAO_CODE] ||
                    'N/A'
                }`);

            store.helicopterLandingZones[hlzId] = objectProp[consts.ONTOLOGY.HAS_HELO_LAND_ZONE];
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_LENGTH] = length;
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_WIDTH] = width;
            store.helicopterLandingZones[hlzId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, store.locations, location['@id']));
            surfaceMats.forEach(sm => {
                store.helicopterLandingZones[hlzId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_SURFACE_MATERIAL, store.surfaceMaterials, sm['@id']));
            });
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_1] = getNumOfLPS(length, width, 1);
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_2] = getNumOfLPS(length, width, 2);
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_3] = getNumOfLPS(length, width, 3);
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_4] = getNumOfLPS(length, width, 4);
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_5] = getNumOfLPS(length, width, 5);
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_6] = getNumOfLPS(length, width, 6);
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_NUM_OF_LAND_SITE_7] = getNumOfLPS(length, width, 7);
            
            store.helicopterLandingZones[hlzId].datatypeProperties[consts.ONTOLOGY.DT_UNIT] = unit || 'ft (Guessed Unit)';
        }
    });
};

function getNumOfLPS(length: number, width: number, size: number): number {
    const lengthInMeters = 0.3048 * length;
    const widthInMeters = 0.3048 * width;
    let minBase;
    let numInWidth: number = 0;
    let numInLength: number = 0;
    switch(size) {
        case 1: {
            minBase = 25;
            break;
        }
        case 2: {
            minBase = 35;
            break
        }
        case 3: {
            minBase = 50;
            break
        }
        case 4: {
            minBase = 80;
            break
        }
        case 5: {
            minBase = 100;
            break
        }
        case 6: {
            minBase = 125;
            break
        }
        case 7: {
            minBase = 150;
            break
        }
    }
    
    numInLength = Math.floor(lengthInMeters / minBase);
    numInWidth = Math.floor(widthInMeters / minBase);
    return numInWidth * numInLength;
}