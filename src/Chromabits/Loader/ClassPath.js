'use strict';

let ensure = require('ensure.js');

let InvalidClassPathException = require(
    './Exceptions/InvalidClassPathException'
);

/**
 * Class ClassPath
 *
 * Parses and extracts information about an Enclosure class path
 */
class ClassPath
{
    /**
     * Construct an instance of a ClassPath
     *
     * @param path
     */
    constructor (path)
    {
        ensure(path, String);

        this.original = path;
        this.relative = false;
        this.path = [];

        /**
         * Namespace Regular Expression
         *
         * This is the expression which defines what is a class namespace
         * and what isn't
         *
         * @type {RegExp}
         */
        this.fullyQualifiedNamespaceRegex =
            /^([/]?)([A-Za-z]+[/])*([A-Za-z]+)$/;

        this.parse();
    }

    /**
     * Check if the class path is valid
     *
     * @returns {Array|{index: number, input: string}}
     */
    isValid ()
    {
        return this.original.match(this.fullyQualifiedNamespaceRegex);
    }

    /**
     * Internally parse the path
     */
    parse ()
    {
        let original = this.original;

        // Check if the classpath string is valid
        if (!this.isValid()) {
            throw new InvalidClassPathException();
        }

        this.relative = true;

        // Check whether or not the class path is relative or absolute
        if (original[0] === '/') {
            this.relative = false;

            original = original.substr(1);
        }

        // Tokenize the path so that it is easier to process
        this.path = original.split('/');
    }

    /**
     * Get the path as a string
     *
     * @returns {string}
     */
    toString ()
    {
        if (this.relative) {
            return this.path.join('/');
        }

        return '/' + this.path.join('/');
    }

    /**
     * Get the name of the class
     *
     * @returns {*}
     */
    getClassName ()
    {
        return this.path[this.path.length - 1];
    }

    /**
     * Get the namespace part of the path
     *
     * @returns {string}
     */
    getNamespace ()
    {
        if (this.path.length > 1) {
            let namespace = this.path.slice(0, this.path.length - 1);

            if (this.isAbsolute()) {
                return '/' + namespace.join('/') + '/';
            }

            return namespace.join('/') + '/';
        }

        return '/';
    }

    /**
     * Get the namespace part of the path as an array
     *
     * @returns {*}
     */
    getNamespaceAsArray ()
    {
        if (this.path.length > 1) {
            return this.path.slice(0, this.path.length - 1);
        }

        return [];
    }

    /**
     * Get whether or not the path is relative
     *
     * @returns {ClassPath.relative|*}
     */
    isRelative ()
    {
        return this.relative;
    }

    /**
     * Get whether or not the path is absolute
     *
     * @returns {boolean}
     */
    isAbsolute ()
    {
        return !this.relative;
    }

    /**
     * Attempt to make the path absolute
     *
     * @returns {*}
     */
    toAbsolute ()
    {
        // The current implementation is nothing fancy. It just appends a
        // slash if it is absolute
        if (!this.isAbsolute()) {
            return '/' + this.original;
        }

        return this.original;
    }
}

module.exports = ClassPath;
