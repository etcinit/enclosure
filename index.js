'use strict';

var Container = require('./src/Chromabits/Container/Container'),
    Wrap = require('./src/Chromabits/Container/Wrap'),
    Loader = require('./src/Chromabits/Loader/Loader.js'),
    EnclosureClassMap = require('./src/Chromabits/Mapper/EnclosureClassMap.js');

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
    bootstrap: function () {
        return this.bootstrapTo(global);
    },

    /**
     * Create a basic environment inside a specific object
     *
     * This allows to use the `use()` function to load Enclosure classes
     * before the container itself is setup.
     *
     * @returns {*}
     */
    bootstrapTo: function (target) {
        var loader = new Loader();

        loader.addMap(EnclosureClassMap);
        target.use = loader.get.bind(loader);

        return this;
    }
};
