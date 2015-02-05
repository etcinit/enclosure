'use strict';

var DirectoryMapper = require('../../src/Chromabits/Mapper/DirectoryMapper'),
    ClassMap = require('../../src/Chromabits/Mapper/ClassMap.js'),
    path = require('path');

describe('DirectoryMapper', function () {
    describe('#generateClassMap', function () {
        var instance = new DirectoryMapper(path.resolve(__dirname, '../../src'));

        instance.generate().should.be.instanceOf(ClassMap);
    });
});
