'use strict';

let root = '../../../src/',
    path = require('path');

var AbstractMapper = require(root + 'Chromabits/Mapper/AbstractMapper.js'),
    DirectoryMapper = require(root + 'Chromabits/Mapper/DirectoryMapper.js'),
    ClassMap = require(root + 'Chromabits/Mapper/ClassMap.js');

describe('Chromabits/Mapper/DirectoryMapper', function () {
    it('should be a constructor', function () {
      var instance = new DirectoryMapper(
          path.resolve(__dirname, root, '../example')
      );

      instance.should.be.instanceOf(DirectoryMapper);
      instance.should.be.instanceOf(AbstractMapper);
    });

    describe('#generate', function () {
        it('should generate a class map', function () {
            var instance = new DirectoryMapper(
                path.resolve(__dirname, root, '../example')
            );

            instance.generate().should.be.instanceOf(ClassMap);
        });
    });

    describe('#generateClassPath', function () {
        it('should generate a class path string', function () {
            var instance = new DirectoryMapper(
                path.resolve(__dirname, root, '../example')
            );

            instance.generateClassPath(
                path.resolve(__dirname, root, '../example'),
                path.resolve(__dirname, root, '../example/Class.js')
            ).should.be.equal('/Class');
        });
    });
});
