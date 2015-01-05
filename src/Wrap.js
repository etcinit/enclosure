"use strict";

var Wrap,

    ensure = require('ensure.js');

/**
 * Dependency wrapper for the Enclosure container
 *
 * The constructor will be called when all its dependencies
 * are resolvable. The first argument provided will be the
 * instance of the container that is resolving the class
 * followed by instances of every dependency in the order
 * they are specified in the dependencies array
 *
 * @param dependencies
 * @param constructor
 * @constructor
 */
Wrap = function (dependencies, constructor) {
    this.dependencies = dependencies || [];

    ensure(constructor, Function);

    this.constructor = constructor;
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
