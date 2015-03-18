'use strict';

let Container = require('./Chromabits/Container/Container'),
    Wrap = require('./Chromabits/Container/Wrap'),
    Loader = require('./Chromabits/Loader/Loader.js'),
    Bootstrapper = require('./Chromabits/Bootstrapper/Bootstrapper.js');

module.exports = {
    // Keep backwards compatibility
    Container: Container,
    Wrap: Wrap,

    /**
     * Create a basic environment for setting up a container
     *
     * This allows to use the `use()` function to load Enclosure classes
     * before the container itself is setup.
     *
     * @returns {*}
     */
    prelude () {
        return this.preludeTo(global);
    },

    /**
     * Create a basic environment inside a specific object
     *
     * This allows to use the `use()` function to load Enclosure classes
     * before the container itself is setup.
     *
     * @returns {*}
     */
    preludeTo (target)
    {
        Bootstrapper.setupPrelude(target);
    },

    /**
     * Use the bootstrapper
     *
     * @param options
     *
     * @returns {Application}
     */
    boot (options)
    {
        let bootstrapper = new Bootstrapper(options);

        return bootstrapper.boot();
    },

    /**
     * Use the bootstrapper but do not run the entry point
     *
     * @param options
     *
     * @returns {Application}
     */
    softBoot (options)
    {
        let bootstrapper = new Bootstrapper(options);

        return bootstrapper.softBoot();
    }
};
