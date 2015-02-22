'use strict';

var ServiceProvider;

/**
 * A service provider is a class capable of registering services into the
 * Enclosure container.
 *
 * @returns {undefined} -
 */
ServiceProvider = function () {
    this.booted = false;
    this.registered = false;
};

/**
 * Boot the provider
 *
 * @param {Container} app - The current instance of the container
 *
 * @returns {undefined} -
 */
ServiceProvider.prototype.boot = function (app) {
    //
};

/**
 * Register services into the container
 *
 * @param {Container} app = The current instance of the container
 *
 * @returns {undefined} -
 */
ServiceProvider.prototype.register = function (app) {
    throw new Error('A provider must implement the register method');
};

/**
 * Return an array of services provided
 *
 * @return {Array} -
 */
ServiceProvider.prototype.provides = function () {
    return [];
};

module.exports = ServiceProvider;
