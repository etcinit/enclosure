'use strict';

var ensure = require('ensure.js');

var ClassMap;

ClassMap = function () {
    // Initialize properties
    this.files = {};
    this.constructors = {};
};

ClassMap.prototype.addFile = function(fullClassName, filePath) {
    ensure(fullClassName, String);
    ensure(filePath, String);

    this.files[fullClassName] = filePath;
};

ClassMap.prototype.addConstructor = function(fullClassName, constructor) {
    ensure(fullClassName, String);
    ensure(constructor, Function);

    this.constructors[fullClassName] = constructor;
};

ClassMap.prototype.get = function (fullClassName) {
    if (fullClassName in this.constructors) {
        return this.constructors[fullClassName];
    }

    if (fullClassName in this.files) {
        return require(this.files[fullClassName]);
    }

    throw new Error('Class not defined in this map object');
};

ClassMap.prototype.has = function (fullClassName) {
    if (fullClassName in this.constructors || fullClassName in this.files) {
        return true;
    }

    return false;
};
module.exports = ClassMap;
