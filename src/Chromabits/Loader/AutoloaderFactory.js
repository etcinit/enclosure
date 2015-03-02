'use strict';

let path = require('path');

let Loader = require('./Loader.js'),
    DirectoryMapper = require('../Mapper/DirectoryMapper.js'),
    EnclosureClassMap = require('../Mapper/EnclosureClassMap.js');

/**
 * Class AutoloaderFactory
 *
 * Utility class for constructing a complex class loader out of a configuration
 * object.
 *
 * Currently this class supports the following methods for creating class
 * maps. Each method can be specified in the configuration object:
 *
 * - Roots (roots): A simple array containing paths to directories which contain
 * root namespaces. This approach does not support prefixes.
 * - Enclosure (enclosure): A boolean indicating whether or not to include the
 * Enclosure mapper (for all the classes in the enclosure lib) in the loader.
 *
 * Planned methods (possibly available in future versions):
 *
 * - Prefixes (prefix): Similar to Roots, but it supports defining a namespace
 * prefix for each directory.
 * - Node Modules (modules): This method recursive scans the node_modules
 * directory and creates a complete map of all classes provided by external
 * components. The configurations object could specify aliases or skipped
 * components.
 */
class AutoloaderFactory
{
    /**
     * Construct an instance of an AutoloaderFactory
     *
     * @param config
     */
    constructor (config)
    {
        this.config = config;

        // If nothing is specified, the Enclosure mapper will be included as
        // well
        if (this.config.enclosure === undefined) {
            this.config.enclosure = true;
        }
    }

    /**
     * Construct the loader
     *
     * @returns {Loader}
     */
    make ()
    {
        let loader = new Loader(),
            mappers = this.makeMappers();

        // Add enclosure map
        if (this.config.enclosure) {
            loader.addMap(EnclosureClassMap);
        }

        // Add mappers
        mappers.forEach((mapper) => {
            loader.addMap(mapper.generate());
        });

        return loader;
    }

    /**
     * Construct all the mappers that will go into the loader
     *
     * @returns {Array}
     */
    makeMappers ()
    {
        let mappers = [];

        // Make root mappers
        if (this.config.roots) {
            this.config.roots.forEach((root) => {
                mappers.push(
                    new DirectoryMapper(
                        path.resolve(this.config.path, root),
                        this.config.extensions
                    )
                );
            });
        }

        return mappers;
    }
}

module.exports = AutoloaderFactory;
