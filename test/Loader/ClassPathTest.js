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

            new ClassPath('MyClass')
                .getClassName().should.be.equal('MyClass');

            new ClassPath('/MyClass')
                .getClassName().should.be.equal('MyClass');
        });
    });

    describe('#getNamespace', function () {
        it('should return the namespace as a string', function () {
            new ClassPath('Chromabits/Testing/MyClass')
                .getNamespace().should.be.equal('Chromabits/Testing/');

            new ClassPath('/Chromabits/Testing/MyClass')
                .getNamespace().should.be.equal('/Chromabits/Testing/');

            new ClassPath('MyClass')
                .getNamespace().should.be.equal('/');

            new ClassPath('/MyClass')
                .getNamespace().should.be.equal('/');
        });
    });

    describe('#getNamespaceAsArray', function () {
        it('should return the namespace as an array', function () {
            var namespace = new ClassPath('Chromabits/Testing/MyClass')
                .getNamespaceAsArray();

            namespace[0].should.be.equal('Chromabits');
            namespace[1].should.be.equal('Testing');

            new ClassPath('MyClass')
                .getNamespaceAsArray().length.should.be.equal(0);
        });
    });

    describe('#isRelative', function () {
        it('should return whether or not the path is relative', function () {
            new ClassPath('Chromabits/Testing/MyClass')
                .isRelative().should.be.true;

            new ClassPath('/Chromabits/Testing/MyClass')
                .isRelative().should.be.false;
        });
    });

    describe('#isAbsolute', function () {
        it('should return whether or not the path is relative', function () {
            new ClassPath('Chromabits/Testing/MyClass')
                .isAbsolute().should.be.false;

            new ClassPath('/Chromabits/Testing/MyClass')
                .isAbsolute().should.be.true;
        });
    });
});
