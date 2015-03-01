'use strict';

let Container = require('./Chromabits/Container/Container'),
    Wrap = require('./Chromabits/Container/Wrap'),
    Loader = require('./Chromabits/Loader/Loader.js'),
    EnclosureClassMap = require('./Chromabits/Mapper/EnclosureClassMap.js');

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
    prelude: function () {
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
    preludeTo: function (target) {
        var loader = new Loader();

        loader.addMap(EnclosureClassMap);
        target.use = loader.get.bind(loader);

        return this;
    }
};
