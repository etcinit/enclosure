'use strict';

var ensure = require('ensure.js'),
    ClassNotFoundException = require('./Exceptions/ClassNotFoundException.js'),
    ClassMap = require('../Mapper/ClassMap.js');

var Loader;

/**
 * ClassLoader
 *
 * Capable of loading a class using multiple class maps. A class will be
 * resolved in the order the class maps have been added.
 *
 * @return {undefined} -
 */
Loader = function () {
    this.maps = [];
};

/**
 * Add a map to the loader
 *
 * @param {enclosure.Chromabits.Mapper.ClassMap} map -
 *
 * @return {undefined} -
 */
Loader.prototype.addMap = function (map) {
    ensure(map, ClassMap);

    this.maps.push(map);
};

/**
 * Get the constructor for the specified class
 *
 * @param {String} fullClassName -
 *
 * @return {Function} -
 */
Loader.prototype.get = function (fullClassName) {
    for (var map in this.maps) {
        if (map.has(fullClassName)) {
            return map.get(fullClassName);
        }
    }

    throw new ClassNotFoundException(fullClassName);
};

module.exports = Loader;
