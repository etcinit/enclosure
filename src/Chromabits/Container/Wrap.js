'use strict';

let ensure = require('ensure.js');

let Nullable = ensure.Nullable;

/**
 * Dependency wrapper for the Enclosure container
 *
 * The constructor will be called when all its dependencies
 * are resolvable. The first argument provided will be the
 * instance of the container that is resolving the class
 * followed by instances of every dependency in the order
 * they are specified in the dependencies array
 */
class Wrap
{
    /**
     * Construct an instance of a Wrap
     *
     * @param dependencies
     * @param constructor
     */
    constructor (dependencies, constructor)
    {
        ensure(dependencies, Nullable(Array));
        ensure(constructor, Function);

        this.dependencies = dependencies || [];

        this.constructor = constructor;
    }

    /**
     * Get an array of strings specifying the dependencies required
     * by this class/module
     *
     * @returns {*|Array}
     */
    getDependencies ()
    {
        return this.dependencies;
    }

    /**
     * Get the constructor function of the class/module
     *
     * @returns {*}
     */
    getConstructor ()
    {
        return this.constructor;
    }
}

module.exports = Wrap;
