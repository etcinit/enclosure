'use strict';

let walkdir = require('walkdir'),
    path = require('path');

let ArrayUtils = require('../Util/ArrayUtils.js'),
    AbstractMapper = require('./AbstractMapper.js'),
    ClassMap = require('./ClassMap.js');

/**
 * Directory Mapper
 *
 * A class mapper capable of capable of generating a class map out of a
 * directory structure.
 */
class DirectoryMapper extends AbstractMapper
{
    /**
     * Construct an instance of a DirectoryMapper
     *
     * @param {string} baseDir - Directory to use as the root of the map
     * @param extensions
     */
    constructor (baseDir, extensions = ['js']) {
        // Call parent constructor
        super(...arguments);

        this.baseDir = path.resolve(baseDir);
        this.extensions = extensions;
    }

    /**
     * Generates a class map
     *
     * @returns {ClassMap}
     */
    generate () {
        let paths,
            basePath = null,
            classPath,
            map;

        map = new ClassMap();
        paths = walkdir.sync(this.baseDir, { return_object: true});

        for (let filePath in paths) {
            if (paths.hasOwnProperty(filePath)) {
                let stat = paths[filePath];

                if (stat.isFile()
                    && DirectoryMapper.matchesFileType(
                        filePath,
                        this.extensions
                    )
                ) {
                    classPath = this.generateClassPath(basePath, filePath);

                    map.addFile(classPath, filePath);
                }
            }
        }

        return map;
    }

    /**
     * Generate a class path
     *
     * @param basePath
     * @param fullPath
     *
     * @returns {string}
     */
    generateClassPath (basePath, fullPath) {
        return fullPath.substr(this.baseDir.length).slice(0, -3);
    }

    /**
     * Check if a file matches a list of extensions
     *
     * @param filePath
     * @param extensions
     * @returns {boolean|string}
     */
    static matchesFileType (filePath, extensions = ['.js']) {
        return ArrayUtils.forEachUntil(extensions, (extension) => {
            // Skip this extension if the actual path is shorter
            if (filePath.length < extension.length) {
                return undefined;
            }

            // Check if this extension matches
            if (filePath.slice(-(extension.length)) === extension) {
                return filePath;
            }
        }, false);
    }
}

export default DirectoryMapper;
