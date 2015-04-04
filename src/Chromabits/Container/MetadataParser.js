'use strict';

let fs = require('fs'),
    path = require('path'),
    ensure = require('ensure.js');

/**
 * Class MetadataParser
 *
 * Parses Enclosure metadata out of a JSON object
 */
class MetadataParser
{
    /**
     * Construct an instance of a MetadataParser
     *
     * @param filename
     */
    constructor (filename = {}) {
        if (ensure.isString(filename)) {
            this.data = JSON.parse(fs.readFileSync(filename, 'utf8'));

            // Set the base path to be the location of the package.json
            if (this.data.autoload) {
                this.data.autoload.path = path.dirname(filename);
            }
        } else {
            this.data = filename;

            // Check that autoload path was provided
            if (this.data.autoload) {
                ensure(this.data.autoload, Object);
                ensure(this.data.autoload.path, String);
            }
        }
    }

    /**
     * Get the entrypoint of the application
     *
     * @returns {*}
     */
    getEntrypoint () {
        if (this.data.entrypoint) {
            ensure(this.data.entrypoint, String);

            return this.data.entrypoint;
        }

        return null;
    }

    /**
     * Get service providers for this application
     *
     * @returns {Array}
     */
    getProviders () {
        if (this.data.providers) {
            if (ensure.isArray(this.data.providers)) {
                return this.data.providers;
            }

            throw new Error('Providers key should be an array');
        }

        return [];
    }

    /**
     * Get the autoloader configuration
     *
     * @returns {*}
     */
    getAutoload () {
        if (this.data.autoload) {
            return this.data.autoload;
        }

        return {};
    }
}

module.exports = MetadataParser;
