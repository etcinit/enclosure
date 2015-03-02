'use strict';

let path = require('path');

let DirectoryMapper = require('./DirectoryMapper');

/**
 * EnclosureClassMap
 *
 * A class map containing Enclosure's own classes and objects
 *
 * @type {DirectoryMapper}
 */
let mapper = new DirectoryMapper(path.resolve(__dirname, '../../'));

module.exports = mapper.generate();
