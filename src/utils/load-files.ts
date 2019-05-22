// import * as Logger from 'node_modules/simple-node-logger/index';

import { store } from '../constants/globalStore';
import { loadFile } from './load-file';

export function loadFiles() {
    const LOG_FILE_NAME = 'logs/log-' + ((new Date()).toISOString()).replace(':', '-').replace(':', '-').replace('.', '-').trim() + '.log';
    // store.LOG_STREAM = Logger.createSimpleFileLogger(LOG_FILE_NAME);
    store.LOG_FILE_NAME = LOG_FILE_NAME;

    loadFile('countries', 'countries', true);
    loadFile('airlines', 'airlines');
    loadFile('airports', 'airports');
};
