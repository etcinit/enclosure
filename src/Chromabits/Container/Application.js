'use strict';

let ensure = require('ensure.js'),
    R = require('ramda');

let Container = require('./Container.js'),
    ServiceProvider = require('./ServiceProvider.js');

/**
 * Class Application
 *
 * An extension of the Container class capable of handling and initializing
 * Service Providers
 */
class Application extends Container
{
    /**
     * Construct an instance of an Application
     */
    constructor()
    {
        // Call parent constructor
        super();

        // Initialize properties
        this.providers = [];
    }

    /**
     * Add a provider to the application
     *
     * @param {String|Function|ServiceProvider} provider
     */
    addProvider (provider)
    {
        // If a string is provided, we need to resolve the provider from the
        // container and then try to instantiate it
        if (ensure.isString(provider)) {
            provider = this.make(provider);
        }

        // If a function is provided, it most likely means we need to create
        // an instance of the provider
        if (ensure(provider, Function, true)) {
            var Constructor = provider;

            provider = new Constructor(this);
        }

        // Finally, check that the object is actually a service provider
        // instance
        ensure(provider, ServiceProvider);

        this.providers.push(provider);
    }

    /**
     * Boot all providers in the application
     */
    bootProviders ()
    {
        var self = this;

        function bootProvider (provider) {
            provider.boot(self);
        }

        function isBooted (provider) {
            return !(provider.booted);
        }

        R.forEach(bootProvider, R.filter(isBooted, this.providers));
    }

    /**
     * Register all providers in the application
     */
    register ()
    {
        var self = this;

        function registerProvider (provider) {
            provider.register(self);
        }

        function isRegistered (provider) {
            return !(provider.registered);
        }

        R.forEach(registerProvider, R.filter(isRegistered, this.providers));
    }
}

module.exports = Application;
