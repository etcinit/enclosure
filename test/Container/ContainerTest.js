"use strict";

var Container = require('../../src/Chromabits/Container/Container'),

    Wrap = require('../../src/Chromabits/Container/Wrap');

/**
 * Simple hello world service
 *
 * @constructor
 */
var ServiceOne = function () {

};

ServiceOne.prototype.getName = function () {
    return 'Hello World from ServiceOne';
};

/**
 * Simple hello world service
 *
 * @constructor
 */
var ServiceTwo = function () {

};

ServiceTwo.prototype.getName = function () {
    return 'Hello World from ServiceTwo';
};

/**
 * Simple hello world service
 *
 * @constructor
 */
var ServiceThree = function (ServiceOne, ServiceTwo) {
    this.one = ServiceOne;

    this.two = ServiceTwo;
};

ServiceThree.prototype.gotDependencies = function () {
    return this.one instanceof ServiceOne && this.two instanceof ServiceTwo;
};

describe('Container', function () {
    it('should be a constructor', function() {
        var instance = new Container();

        instance.should.be.instanceOf(Container);
    });

    it('should register a single instance of itself', function () {
        var instance = new Container();

        var container = instance.make('EnclosureContainer');

        container.should.be.instanceOf(Container);
    });

    describe('#instance', function () {
        it('should register singleton instances', function() {
            var oneInstance = new ServiceOne();

            var container = new Container();

            container.instance('ServiceOne', oneInstance);

            container.make('ServiceOne').should.be.equal(oneInstance);

            // It should always return the same instance
            container.make('ServiceOne').should.be.equal(oneInstance);
        });
    });

    describe('#bind', function () {
        it('should allow defining a concrete using a Wrap', function () {
            var oneWrap = new Wrap([], function () {
                return new ServiceOne();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);

            var instanceOne = container.make('ServiceOne');
            var instanceTwo = container.make('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
            instanceTwo.should.be.instanceOf(ServiceOne);

            instanceOne.should.not.be.equal(ServiceTwo);
        });

        it('should allow defining a concrete using a constructor', function () {
            var container = new Container();

            container.bind('ServiceOne', ServiceOne);

            var instanceOne = container.make('ServiceOne');
            var instanceTwo = container.make('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
            instanceTwo.should.be.instanceOf(ServiceOne);

            instanceOne.should.not.be.equal(ServiceTwo);
        });

        it('should allow binding abstracts to a concrete', function () {
            var oneWrap = new Wrap([], function () {
                return new ServiceOne();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);

            container.bind('HelloService', 'ServiceOne');

            var instanceOne = container.make('HelloService');
            var instanceTwo = container.make('HelloService');

            instanceOne.should.be.instanceOf(ServiceOne);
            instanceTwo.should.be.instanceOf(ServiceOne);

            instanceOne.should.not.be.equal(ServiceTwo);
        });

        it('should allow binding abstracts to a concrete on multiple levels', function () {
            var oneWrap = new Wrap([], function () {
                return new ServiceOne();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);

            container.bind('HelloServiceOne', 'ServiceOne');
            container.bind('HelloService', 'HelloServiceOne');

            var instanceOne = container.make('HelloService');
            var instanceTwo = container.make('HelloService');

            instanceOne.should.be.instanceOf(ServiceOne);
            instanceTwo.should.be.instanceOf(ServiceOne);

            instanceOne.should.not.be.equal(ServiceTwo);
        });
    });

    describe('factory', function () {
        it('should allow defining a concrete using a factory function', function () {
            var container = new Container();

            container.factory('ServiceOne', function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            var instanceOne = container.make('ServiceOne');
            var instanceTwo = container.make('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
            instanceTwo.should.be.instanceOf(ServiceOne);

            instanceOne.should.not.be.equal(ServiceTwo);
        });
    });

    describe('build', function () {
        it('should create new instances of concretes from Wraps', function () {
            var oneWrap = new Wrap([], function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);

            var instanceOne = container.build('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should pass parameters to the Wrap inner constructor', function () {
            var oneWrap = new Wrap([], function (app, text) {
                app.should.be.instanceOf(Container);
                text.should.be.equal('Hello');

                return new ServiceOne();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);

            var instanceOne = container.build('ServiceOne', ['Hello']);

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should create new instances of concretes from factory functions', function () {
            var container = new Container();

            container.factory('ServiceOne', function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            var instanceOne = container.build('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should pass parameters to factory functions', function () {
            var container = new Container();

            container.factory('ServiceOne', function (app, text) {
                app.should.be.instanceOf(Container);
                text.should.be.equal('Hello');

                return new ServiceOne();
            });

            var instanceOne = container.build('ServiceOne', ['Hello']);

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should create new instances of concretes from constructors', function () {
            var container = new Container();

            container.bind('ServiceOne', ServiceOne);

            var instanceOne = container.build('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should not create instances of abstracts', function () {
            var container = new Container();

            container.factory('ServiceOne', function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            container.bind('HelloService', 'ServiceOne');

            (function () {
                container.build('HelloService');
            }).should.throw();
        });

        it('should resolve nested dependencies', function () {
            var oneWrap = new Wrap([], function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            var twoWrap = new Wrap(['ServiceOne'], function (app, serviceOne) {
                app.should.be.instanceOf(Container);
                serviceOne.should.be.instanceOf(ServiceOne);

                return new ServiceTwo();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);
            container.bind('ServiceTwo', twoWrap);

            var instanceTwo = container.build('ServiceTwo');

            instanceTwo.should.be.instanceOf(ServiceTwo);
        });

        it('should resolve dependencies for constructors', function () {
            it('should create new instances of concretes from constructors', function () {
                var container = new Container();

                container.bind('ServiceOne', ServiceOne);
                container.bind('ServiceTwo', ServiceTwo);
                container.bind('ServiceThree', ServiceThree);

                var instanceOne = container.build('ServiceThree');

                instanceOne.should.be.instanceOf(ServiceThree);
                instanceOne.gotDependencies().should.be.true;
            });
        });

        it('should detect circular dependencies', function () {
            var oneWrap = new Wrap(['ServiceTwo'], function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            var twoWrap = new Wrap(['ServiceOne'], function (app, serviceOne) {
                app.should.be.instanceOf(Container);
                serviceOne.should.be.instanceOf(ServiceOne);

                return new ServiceTwo();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);
            container.bind('ServiceTwo', twoWrap);

            (function () {
                container.build('ServiceTwo');
            }).should.throw();
        });
    });

    describe('#make', function () {
        it('should give priority to singleton instances', function () {
            var container = new Container();

            var instanceOne = new ServiceOne();

            container.instance('ServiceOne', instanceOne);
            container.bind('ServiceOne', ServiceOne);

            container.make('ServiceOne').should.be.equal(instanceOne);
        });
    });

    describe('#resolveDependencies', function () {
        it('should resolve wrap dependencies', function () {
            var container = new Container();

            var oneWrap = new Wrap(['ServiceTwo', 'ServiceOneClone'], function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            container.bind('ServiceTwo', ServiceTwo);
            container.bind('ServiceOneClone', ServiceOne);

            var dependencies = container.resolveDependencies(oneWrap);

            dependencies[0].should.be.instanceOf(ServiceTwo);
            dependencies[1].should.be.instanceOf(ServiceOne);
        });

        it('should resolve constructor dependencies', function () {
            var container = new Container();

            container.bind('ServiceOne', ServiceOne);
            container.bind('ServiceTwo', ServiceTwo);

            var dependencies = container.resolveDependencies(ServiceThree);

            dependencies[0].should.be.instanceOf(ServiceOne);
            dependencies[1].should.be.instanceOf(ServiceTwo);
        });
    });

    describe('#getConcrete', function () {
        it('should get the concrete bound to an abstract', function () {
            var container = new Container();

            container.bind('ServiceOne', ServiceOne);
            container.bind('HelloService', 'ServiceOne');

            container.getConcrete('HelloService').should.be.equal('ServiceOne');
        });

        it('should fail is there is no concrete bound to an abstract', function () {
            var container = new Container();

            container.bind('HelloService', 'ServiceOne');

            (function () {
                container.getConcrete('HelloService');
            }).should.throw();
        });

        it('should resolve concrete types over abstract chains', function () {
            var container = new Container();

            container.bind('ServiceOne', ServiceOne);
            container.bind('HelloWorldService', 'ServiceOne');
            container.bind('HelloService', 'HelloWorldService');

            container.getConcrete('HelloService').should.be.equal('ServiceOne');
        });
    });

    describe('#isWrapped', function () {
        it('should return true for Wrap concretes', function () {
            var oneWrap = new Wrap([], function () {
                return new ServiceOne();
            });

            var container = new Container();

            container.bind('ServiceOne', oneWrap);

            container.isWrapped('ServiceOne').should.be.true;
        });

        it('should return false for any other kind of concrete', function () {
            var container = new Container();

            container.instance('ServiceOne', new ServiceOne());
            container.factory('ServiceTwo', function () {
                return new ServiceTwo();
            });
            container.bind('ServiceThree', ServiceThree);

            container.isWrapped('ServiceOne').should.be.false;
            container.isWrapped('ServiceTwo').should.be.false;
            container.isWrapped('ServiceThree').should.be.false;
        });
    });

    describe('isResolvable', function () {
        it('should return true if the type is resolvable', function () {
            var container = new Container();

            container.instance('ServiceOne', new ServiceOne());
            container.factory('ServiceTwo', function () {
                return new ServiceTwo();
            });
            container.bind('ServiceThree', ServiceThree);
            container.bind('ServiceOneClone', new Wrap([], function () {
                return new ServiceOne();
            }));

            container.isResolvable('ServiceOne').should.be.true;
            container.isResolvable('ServiceTwo').should.be.true;
            container.isResolvable('ServiceThree').should.be.true;
            container.isResolvable('ServiceOneClone').should.be.true;
        });

        it('should return false if the type is only abstract or does not exist', function () {
            var container = new Container();

            container.bind('ServiceFour', 'ServiceFake');

            container.isResolvable('ServiceFour').should.be.false;
            container.isResolvable('ServiceFive').should.be.false;
        });
    });

    describe('isBuildable', function () {
        it('should return true if there is a factory, Wrap, or constructor binding', function () {
            var container = new Container();

            container.instance('ServiceOne', new ServiceOne());
            container.factory('ServiceTwo', function () {
                return new ServiceTwo();
            });
            container.bind('ServiceThree', ServiceThree);
            container.bind('ServiceOneClone', new Wrap([], function () {
                return new ServiceOne();
            }));

            container.isBuildable('ServiceTwo').should.be.true;
            container.isBuildable('ServiceThree').should.be.true;
            container.isBuildable('ServiceOneClone').should.be.true;
        });

        it('should return false otherwise', function () {
            var container = new Container();

            container.instance('ServiceOne', new ServiceOne());
            container.bind('ServiceFour', 'ServiceFake');

            container.isBuildable('ServiceOne').should.be.false;
            container.isBuildable('ServiceFour').should.be.false;
            container.isBuildable('ServiceFive').should.be.false;
        });
    });
});
