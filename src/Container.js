"use strict";

var Container,

    Wrap = require('./Wrap');

Container = function () {
    this.resolved = [];

    this.bindings = [];

    this.instances = [];

    this.aliases = [];

    this.factories = [];
};

Container.prototype.instance = function (abstract, instance) {
    this.instances[abstract] = instance;
};

Container.prototype.bind = function (abstract, concrete) {
    throw new Error('Not implemented');
};

Container.prototype.bindFactory = function (abstract, concrete) {
    throw new Error('Not implemented');
};

Container.prototype.make = function (abstract) {
    // If there is a singleton instance being managed, return it
    if (abstract in this.instances) {
        return this.instances[abstract];
    }

    throw new Error('Not implemented');
};

Container.prototype.build = function (concrete, parameters) {
    parameters = parameters || [];

    // Check if there is a factory function defined for this function
    // If there is one, we will use it to build the instance. This
    // allows functions to be defined as more refined resolvers
    if (concrete in this.factories) {
        return this.factories[concrete](this, parameters);
    }

    if (this.isWrapped(concrete)) {
        // TODO: Resolve the wrapper using a queue
    }

    throw new Error('Resolving non-wrapped functions is currently not supported');
};

/**
 * Check that a concrete object is wrapped in an Enclosure wrap
 *
 * @param concrete
 * @returns {boolean}
 */
Container.prototype.isWrapped = function (concrete) {
    return (concrete in this.bindings &&
        this.bindings[concrete] instanceof Wrap);
};

Container.prototype.isResolvable = function (abstract) {
    if (this.instances[abstract]) {
        return true;
    }

    // TODO: Bindings
    // TODO: Wraps

    return false;
};

Container.prototype.isResolved = function (abstract) {
    return (abstract in this.resolved);
};

Container.prototype.isBuildable = function (abstract) {
    // TODO: Wraps

    return false;
};

module.exports = Container;
