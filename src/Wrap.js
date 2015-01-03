"use strict";

var Wrap;

/**
 * Dependency wrapper for the Enclosure container
 *
 * The constructor will be called when all its dependencies
 * are resolvable. The first argument provided will be the
 * instance of the container that is resolving the class
 * followed by instances of every dependency in the order
 * they are specified in the dependencies array
 *
 * @param name
 * @param dependencies
 * @param constructor
 * @constructor
 */
Wrap = function (name, dependencies, constructor) {
    this.name = name;

    this.dependencies = dependencies || [];

    this.constructor = constructor;
};

/**
 * Get the name of the class/module
 *
 * @returns {*}
 */
Wrap.prototype.getName = function () {
    return this.name;
};

/**
 * Get an array of strings specifying the dependencies required
 * by this class/module
 *
 * @returns {*|Array}
 */
Wrap.prototype.getDependencies = function () {
    return this.dependencies;
};

/**
 * Get the constructor function of the class/module
 *
 * @returns {*}
 */
Wrap.prototype.getConstructor = function () {
    return this.constructor;
};

module.exports = Wrap;
