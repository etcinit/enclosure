'use strict';

import ensure from 'ensure.js';

import ArrayUtils from '../Util/ArrayUtils.js';
import ClassPath from '../Loader/ClassPath.js';
import ClassNotFoundException from './Exceptions/ClassNotFoundException.js';
import ClassMap from '../Mapper/ClassMap.js';

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
    constructor () {
        this.maps = [];
    }

    /**
     * Add a map to the loader
     *
     * @param {ClassMap} classMap -
     */
    addMap (classMap) {
        ensure(classMap, ClassMap);

        this.maps.push(classMap);
    }

    /**
     * Get the constructor for the specified class
     *
     * @param {String} fullClassName -
     *
     * @return {*} - Class constructor or module exports
     */
    get (fullClassName) {
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
    has (fullClassName) {
        var path = new ClassPath(fullClassName),
            absoluteClassName = path.toAbsolute();

        return ArrayUtils.forEachUntil(this.maps, (map) => {
            if (map.has(absoluteClassName)) {
                return true;
            }
        }, false);
    }
}

export default Loader;
