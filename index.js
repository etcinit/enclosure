'use strict';

var Container = require('./src/Chromabits/Container/Container'),
    Wrap = require('./src/Chromabits/Container/Wrap'),
    ClassMap = require('./src/Chromabits/Mapper/ClassMap.js'),
    Loader = require('./src/Chromabits/Loader/Loader.js'),
    EnclosureClassMap = require('./src/Chromabits/Mapper/EnclosureClassMap.js'),
    DirectoryMapper = require('./src/Chromabits/Mapper/DirectoryMapper.js');

module.exports = {
    // Keep backwards compatibility
    Container: Container,
    Wrap: Wrap,

    bootstrap: function () {
        return this.bootstrapTo(global);
    },

    bootstrapTo: function (target) {
        var loader = new Loader();

        loader.addMap(EnclosureClassMap);
        target.use = loader.get.bind(loader);

        return this;
    },

    // Use a more namespace-ish object for everything else
    Chromabits: {
        Container: {
            Application: require('./src/Chromabits/Container/Application.js'),
            Container: Container,
            ServiceProvider:
                require('./src/Chromabits/Container/ServiceProvider.js'),
            Wrap: Wrap
        },
        Loader: {
            Exceptions: {
                ClassNotFoundException: require(
                    './src/Chromabits/Loader' +
                    '/Exceptions/ClassNotFoundException.js'
                )
            },
            ClassPath: require('./src/Chromabits/Loader/ClassPath.js'),
            Loader: Loader
        },
        Mapper: {
            AbstractMapper:
                require('./src/Chromabits/Mapper/AbstractMapper.js'),
            ClassMap: require('./src/Chromabits/Mapper/ClassMap.js'),
            DirectoryMapper:
                require('./src/Chromabits/Mapper/DirectoryMapper.js'),
            EnclosureClassMap:
                require('./src/Chromabits/Mapper/EnclosureClassMap.js')
        }
    }
};
