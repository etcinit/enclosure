'use strict';

let ensure = require('ensure.js');

/**
 * Class ClassMap
 *
 * A collection of maps between abstract class names and their actual
 * implementations.
 *
 * While this class allows defining file and constructor mappings, child
 * classes could implement other mapping types such as fetching files from a
 * web server (for browser compatibility)
 */
class ClassMap
{
    /**
     * Constructs an instance of a ClassMap
     */
    constructor ()
    {
        // Initialize properties
        this.files = {};
        this.constructors = {};
    }

    /**
     * Add a file mapping
     *
     * The provided file should export the constructor of the class
     *
     * @param fullClassName
     * @param filePath
     */
    addFile (fullClassName, filePath)
    {
        ensure(fullClassName, String);
        ensure(filePath, String);

        this.files[fullClassName] = filePath;
    }

    /**
     * Add a function mapping
     *
     * The provided function should be the constructor of the class
     *
     * @param fullClassName
     * @param constructor
     */
    addConstructor (fullClassName, constructor)
    {
        ensure(fullClassName, String);
        ensure(constructor, Function);

        this.constructors[fullClassName] = constructor;
    }

    /**
     * Get the constructor of the provided class
     *
     * @param fullClassName
     * @returns {*}
     */
    get (fullClassName)
    {
        if (fullClassName in this.constructors) {
            return this.constructors[fullClassName];
        }

        if (fullClassName in this.files) {
            return require(this.files[fullClassName]);
        }

        throw new Error('Class not defined in this map object');
    }

    /**
     * Check if this map contains a class
     *
     * @param fullClassName
     * @returns {boolean}
     */
    has (fullClassName)
    {
        if (fullClassName in this.constructors || fullClassName in this.files) {
            return true;
        }

        return false;
    }
}

module.exports = ClassMap;
