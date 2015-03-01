'use strict';

let ensure = require('ensure.js');

let ArrayUtils = require('../Util/ArrayUtils.js'),
    ClassPath = require('../Loader/ClassPath.js'),
    ClassNotFoundException = require('./Exceptions/ClassNotFoundException.js'),
    ClassMap = require('../Mapper/ClassMap.js');

/**
 * ClassLoader
 *
 * Capable of loading a class using multiple class maps. A class will be
 * resolved in the order the class maps have been added.
 */
class Loader
{
    /**
     * Construct an instance of a Loader
     */
    constructor ()
    {
        this.maps = [];
    }

    /**
     * Add a map to the loader
     *
     * @param {ClassMap} classMap -
     */
    addMap (classMap)
    {
        ensure(map, ClassMap);

        this.maps.push(map);
    }

    /**
     * Get the constructor for the specified class
     *
     * @param {String} fullClassName -
     *
     * @return {*} - Class constructor or module exports
     */
    get (fullClassName)
    {
        var path = new ClassPath(fullClassName),
            absoluteClassName = path.toAbsolute();

        let constructor = ArrayUtils.forEachUntil(this.maps, (map) => {
            if (map.has(absoluteClassName)) {
                return map.get(absoluteClassName);
            }
        }, false);

        if (constructor) {
            return constructor;
        }

        throw new ClassNotFoundException(fullClassName);
    }

    /**
     * Check if this loader is capable of finding a class constructor
     *
     * @param fullClassName
     *
     * @returns {boolean}
     */
    has (fullClassName)
    {
        var path = new ClassPath(fullClassName),
            absoluteClassName = path.toAbsolute();

        return ArrayUtils.forEachUntil(this.maps, (map) => {
            if (map.has(absoluteClassName)) {
                return true;
            }
        }, false);
    }
}

module.exports = Loader;
