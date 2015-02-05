'use strict';

var walkdir = require('walkdir'),
    path = require('path'),
    AbstractMapper = require('./AbstractMapper.js'),
    ClassMap = require('./ClassMap.js');

var DirectoryMapper;

/**
 * Directory Mapper
 *
 * A class mapper capable of capable of generating a class map out of a
 * directory structure.
 *
 * @param {String} baseDir - Directory to use as the root of the map
 *
 * @returns {undefined} -
 */
DirectoryMapper = function (baseDir) {
    // Call parent constructor
    AbstractMapper.call(this, arguments);

    this.baseDir = path.resolve(baseDir);
};

DirectoryMapper.prototype = new AbstractMapper();

DirectoryMapper.prototype.generate = function () {
    var paths,
        basePath = null,
        classPath,
        map;

    map = new ClassMap();
    paths = walkdir.sync(this.baseDir, { return_object: true});

    for (var filePath in paths) {
        if (paths.hasOwnProperty(filePath)) {
            var stat = paths[filePath];

            if (stat.isFile() && filePath.slice(-3) === '.js') {
                classPath = this.generateClassPath(basePath, filePath);

                map.addFile(classPath, filePath);
            }
        }
    }

    return map;
};

DirectoryMapper.prototype.generateClassPath = function (basePath, fullPath) {
    return fullPath.substr(this.baseDir.length).slice(0, -3);
};

module.exports = DirectoryMapper;
