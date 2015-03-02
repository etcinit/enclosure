'use strict';

let NotImplementedException = require(
    '../Exceptions/NotImplementedException.js'
);

/**
 * Class ServiceProvider
 *
 * A service provider is an object capable of registering services into an
 * Enclosure Application or Container
 */
class ServiceProvider
{
    /**
     * Construct an instance of a ServiceProvider
     */
    constructor ()
    {
        this.booted = false;
        this.registered = false;
        this.deferred = false;
    }

    /**
     * Boot the provider
     *
     * @param {Container} app - The current instance of the container
     */
    boot (app)
    {
        //
    }

    /**
     * Register services into the container
     *
     * @param {Container} app = The current instance of the container
     */
    register (app)
    {
        throw new NotImplementedException('register()');
    }

    /**
     * Return an array of services provided
     *
     * @returns {Array}
     */
    provides ()
    {
        return [];
    }
}

module.exports = ServiceProvider;
