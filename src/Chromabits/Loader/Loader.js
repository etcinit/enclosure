'use strict';

var ensure = require('ensure.js'),
    ClassPath = require('../Loader/ClassPath'),
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
    var path = new ClassPath(fullClassName),
        absoluteClassName = path.toAbsolute();

    for (var key in this.maps) {
        if (this.maps.hasOwnProperty(key)) {
            var map = this.maps[key];

            if (map.has(absoluteClassName)) {
                return map.get(absoluteClassName);
            }
        }
    }

    throw new ClassNotFoundException(fullClassName);
};

Loader.prototype.has = function (fullClassName) {
    var path = new ClassPath(fullClassName),
        absoluteClassName = path.toAbsolute();

    for (var key in this.maps) {
        if (this.maps.hasOwnProperty(key)) {
            var map = this.maps[key];

            if (map.has(absoluteClassName)) {
                return true;
            }
        }
    }

    return false;
};

module.exports = Loader;
