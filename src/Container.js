"use strict";

var Container,

    Wrap = require('./Wrap'),

    ensure = require('ensure.js');

Container = function () {
    this.resolved = [];

    this.bindings = [];

    this.instances = [];

    this.aliases = [];

    this.factories = [];

    this.buildStack = [];

    this.maxDepth = 255;
};

/**
 * Bind a singleton instance to an abstract
 *
 * @param abstract
 * @param instance
 */
Container.prototype.instance = function (abstract, instance) {
    this.instances[abstract] = instance;
};

/**
 * Bind an abstract with a concrete with an abstract
 *
 * Acceptable concrete types are Wrap objects or a String
 * reference to another abstract type which eventually
 * should resolve into a concrete
 *
 * @param abstract
 * @param concrete
 */
Container.prototype.bind = function (abstract, concrete) {
    // If the concrete implementation is either a string or a Wrap,
    // we just create a binding
    if (concrete instanceof Wrap || ensure.isString(concrete)) {
        this.bindings[abstract] = concrete;
    }

    // If the concrete implementation is a function, then
    // we assume it is a factory function
    if (concrete instanceof Function) {
        this.factories[abstract] = concrete;
    }

    throw new Error('Unsupported binding type');
};

/**
 * Attempt to find the concrete implementation associated with
 * an abstract
 *
 * @param abstract
 * @returns {*}
 */
Container.prototype.getConcrete = function (abstract) {
    // If the abstract is not defined in the bindings array
    // then we can't find a concrete, so we have to bail
    if (!(abstract in this.bindings)) {
        throw new Error('Unable to resolve concrete type');
    }

    var concrete = this.bindings[abstract];

    // If the concrete is a string, then it still is abstract
    // so we need to recurse and try to find it's concrete
    if (ensure.isString(concrete)) {
        return this.getConcrete(concrete);
    }

    // If there is a Wrap bound to the abstract, then we know
    // it is actually already concrete
    if (concrete instanceof Wrap) {
        return abstract;
    }

    throw new Error('Unable to resolve concrete type. Unknown binding type');
};

/**
 * Resolve the abstract in the container
 *
 * @param abstract
 * @returns {*}
 */
Container.prototype.make = function (abstract) {
    // If there is a singleton instance being managed, return it
    if (abstract in this.instances) {
        return this.instances[abstract];
    }

    // Get concrete
    var concrete = this.getConcrete(abstract);

    // If buildable, build one
    if (this.isBuildable(concrete)) {
        return this.build(concrete);
    }

    throw new Error('Unable to build dependency');
};

Container.prototype.build = function (concrete, parameters) {
    parameters = parameters || [];

    // Check if there is a factory function defined for this function
    // If there is one, we will use it to build the instance. This
    // allows functions to be defined as more refined resolvers
    if (concrete in this.factories) {
        return this.factories[concrete](this, parameters);
    }

    this.buildStack.push(concrete);

    // Check if we have descended too much into the dependency tree.
    // This could mean we have a circular dependency or a very complex
    // application
    if (this.buildStack.length > this.maxDepth) {
        throw new Error('Max dependency depth reached. Possible circular dependency');
    }

    // If the concrete is a Wrap object, we can resolve its dependencies
    // and then construct an instance
    if (this.isWrapped(concrete)) {
        // TODO: Resolve the wrapper using a queue

        this.buildStack.pop();
    }

    throw new Error('Unable to resolve. The concrete type is not instantiable');
};

/**
 * Use the container to get the dependencies of a Wrap
 *
 * @param wrap
 * @returns {Array}
 */
Container.prototype.getDependencies = function (wrap) {
    var dependenciesNames = wrap.getDependencies(),
        dependencies = [];

    dependenciesNames.forEach(function (dependencyName) {
        dependencies.push(this.make(dependencyName))
    }.bind(this));

    return dependencies;
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

Container.prototype.isBuildable = function (concrete) {
    // TODO: Wraps

    return false;
};

module.exports = Container;
