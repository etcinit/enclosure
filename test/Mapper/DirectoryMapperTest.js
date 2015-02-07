'use strict';

var enclosure = require('../../index.js'),
    path = require('path');

var AbstractMapper = enclosure.Chromabits.Mapper.AbstractMapper,
    DirectoryMapper = enclosure.Chromabits.Mapper.DirectoryMapper,
    ClassMap = enclosure.Chromabits.Mapper.ClassMap;

describe('DirectoryMapper', function () {
    it('should be a constructor', function () {
      var instance = new DirectoryMapper(
          path.resolve(__dirname, '../../example')
      );

      instance.should.be.instanceOf(DirectoryMapper);
      instance.should.be.instanceOf(AbstractMapper);
    });

    describe('#generate', function () {
        it('should generate a class map', function () {
            var instance = new DirectoryMapper(
                path.resolve(__dirname, '../../example')
            );

            instance.generate().should.be.instanceOf(ClassMap);
        });
    });

    describe('#generateClassPath', function () {
        it('should generate a class path string', function () {
            var instance = new DirectoryMapper(
                path.resolve(__dirname, '../../example')
            );

            instance.generateClassPath(
                path.resolve(__dirname, '../../example'),
                path.resolve(__dirname, '../../example/Class.js')
            ).should.be.equal('/Class');
        });
    });
});
