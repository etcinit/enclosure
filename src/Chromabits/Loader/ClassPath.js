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
};

ClassPath.prototype.isValid = function () {
    return this.original.match(this.fullyQualifiedNamespaceRegex);
};

ClassPath.prototype.parse = function () {
    var original = this.original;

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

};

ClassPath.prototype.getNamespace = function () {

};

ClassPath.prototype.isRelative = function () {

};

ClassPath.prototype.isAbsolute = function () {

};

module.export = ClassPath;
