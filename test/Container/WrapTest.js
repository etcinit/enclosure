"use strict";

var Wrap = require('../../src/Chromabits/Container/Wrap');

describe('Wrap', function () {
    it('should be a constructor', function () {
        var instance = new Wrap([], function () {});

        instance.should.be.instanceOf(Wrap);
    });

    it('should fail if no inner constructor is provided', function () {
        (function () {
            var instance = new Wrap();

            instance.should.be.instanceOf(Wrap);
        }).should.throw();
    });

    describe('#getDependencies', function () {
        it('should return an empty array if no dependencies were provided', function () {
            var instance = new Wrap([], function () {});

            instance.getDependencies().length.should.be.equal(0);
        });

        it('should return the dependencies array', function () {
            var dependencies = ['MyService'];

            var instance = new Wrap(dependencies, function () {});

            instance.getDependencies().should.be.equal(dependencies);
        });
    });

    describe('#getConstructor', function () {
        it('should return the inner constructor function', function () {
            var MyService = function () {};

            var instance = new Wrap([], MyService);

            instance.getConstructor().should.be.equal(MyService);
        });
    });
});
