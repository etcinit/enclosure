"use strict";

var Container;

Container = function () {
    this.resolved = [];

    this.bindings = [];

    this.instances = [];

    this.aliases = [];
};

Container.prototype.instance = function (abstract, instance) {
    this.instances[abstract] = instance;
};

Container.prototype.bind = function (abstract, concrete) {
    throw new Error('Not implemented');
};

Container.prototype.make = function (abstract) {
    // If there is a singleton instance being managed, return it
    if (abstract in this.instances) {
        return this.instances[abstract];
    }

    throw new Error('Not implemented');
};

Container.prototype.build = function (abstract) {
    throw new Error('Not implemented');
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
