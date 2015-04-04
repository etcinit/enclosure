'use strict';

import path from 'path';

import DirectoryMapper from './DirectoryMapper';

/**
 * EnclosureClassMap
 *
 * A class map containing Enclosure's own classes and objects
 *
 * @type {DirectoryMapper}
 */
let mapper = new DirectoryMapper(path.resolve(__dirname, '../../'));

export default mapper.generate();
