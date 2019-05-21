import { consts } from "../constants/constants";

export function getCountryURL(abbrev: string): string {
    return consts.BASE.URL_LEADER_BASE + abbrev.toUpperCase() + '.html';
}