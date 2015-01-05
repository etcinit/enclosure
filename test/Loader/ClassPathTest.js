"use strict";

var ClassPath = require('../../src/Chromabits/Loader/ClassPath');

describe('ClassPath', function () {
    it('should be a constructor', function () {
        var instance = new ClassPath('Chromabits/Testing/MyClass');

        instance.should.be.instanceOf(ClassPath);
    });

    it('should not fail if the path is valid', function () {
        (function () {
            new ClassPath('Chromabits/Testing/MyClass');
        }).should.not.throw();

        (function () {
            new ClassPath('/Chromabits/Testing/MyClass');
        }).should.not.throw();

        (function () {
            new ClassPath('MyClass');
        }).should.not.throw();

        (function () {
            new ClassPath('/MyClass');
        }).should.not.throw();
    });

    it('should fail if the path is invalid', function () {
        (function () {
            new ClassPath('Chromabits/Testing/');
        }).should.throw();

        (function () {
            new ClassPath('Chromabits/Testing/123');
        }).should.throw();

        (function () {
            new ClassPath('Chromabits/Testing/invalid_class');
        }).should.throw();

        (function () {
            new ClassPath('/');
        }).should.throw();

        (function () {
            new ClassPath('Chromabits/');
        }).should.throw();
    });

    describe('#toString', function () {
        it('should return the same path given in the constructor', function () {
            new ClassPath('Chromabits/Testing/MyClass')
                .toString().should.be.equal('Chromabits/Testing/MyClass');

            new ClassPath('/Chromabits/Testing/MyClass')
                .toString().should.be.equal('/Chromabits/Testing/MyClass');

            new ClassPath('MyClass')
                .toString().should.be.equal('MyClass');

            new ClassPath('/MyClass')
                .toString().should.be.equal('/MyClass');
        });
    });

    describe('#getClassName', function () {
        it('should return the class name', function () {
            new ClassPath('Chromabits/Testing/MyClass')
                .getClassName().should.be.equal('MyClass');

            new ClassPath('/Chromabits/Testing/MyClass')
                .getClassName().should.be.equal('MyClass');
        });
    });
});
