"use strict";

var ClassPath,

    ensure = require('ensure.js');

ClassPath = function (path) {
    ensure(path, String);

    this.original = path;

    this.relative = false;

    this.path = [];

    /**
     * Namespace Regular Expression
     *
     * This is the expression which defines what is a class namespace and what isn't
     *
     * @type {RegExp}
     */
    this.fullyQualifiedNamespaceRegex = /^([/]?)([A-Za-z]+[/])*([A-Za-z]+)$/;

    this.parse();
};

ClassPath.prototype.isValid = function () {
    return this.original.match(this.fullyQualifiedNamespaceRegex);
};

ClassPath.prototype.parse = function () {
    var original = this.original;

    // Check if the classpath string is valid
    if (!this.isValid()) {
        throw new Error('ClassPath is not valid');
    }

    this.relative = true;

    // Check whether or not the class path is relative or absolute
    if (original[0] === '/') {
        this.relative = false;

        original = original.substr(1);
    }

    // Tokenize the path so that it is easier to process
    this.path = original.split('/');
};

ClassPath.prototype.toString = function () {
    if (this.relative) {
        return this.path.join('/');
    }

    return '/' + this.path.join('/');
};

ClassPath.prototype.getClassName = function () {
    return this.path[this.path.length - 1];
};

ClassPath.prototype.getNamespace = function () {
    if (this.path.length > 1) {
        var namespace = this.path.slice(0, this.path.length - 1);

        if (this.isAbsolute()) {
            return '/' + namespace.join('/');
        }

        return namespace.join('/');
    }

    return '/';
};

ClassPath.prototype.getNamespaceAsArray = function () {
    if (this.path.length > 1) {
        return this.path.slice(0, this.path.length - 1);
    }

    return [];
};

ClassPath.prototype.isRelative = function () {
    return this.relative;
};

ClassPath.prototype.isAbsolute = function () {
    return !this.relative;
};

module.exports = ClassPath;
