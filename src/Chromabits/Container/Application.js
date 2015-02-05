'use strict';

var ensure = require('ensure.js'),
    Container = require('./Container.js'),
    ServiceProvider = require('./ServiceProvider.js');

var Application;

Application = function () {
    // Call parent constructor
    Container.call(this, arguments);

    // Initialize properties
    this.providers = [];
};

// Inherit enclosure.Container
Application.prototype = new Container();

/**
 * Add a provider to the application
 *
 * @param {String|Function|ensure.ServiceProvider} provider -
 *
 * @returns {undefined} =
 */
Application.prototype.addProvider = function (provider) {
    // If a string is provided, we need to resolve the provider from the
    // container and then try to instantiate it
    if (ensure.isString(provider)) {
        provider = this.make(provider);
    }

    // If a function is provided, it most likely means we need to create
    // an instance of the provider
    if (ensure.isFunction(provider)) {
        var Constructor = provider;

        provider = new Constructor(this);
    }

    // Finally, check that the object is actually a service provider instance
    ensure(provider, ServiceProvider);

    this.providers.push(provider);
};

Application.prototype.bootProviders = function () {

};

Application.prototype.register = function () {

};

module.exports = Application;
