"use strict";

var Container = require('../src/Container'),

    Wrap = require('../src/Wrap');

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

describe('Container', function () {
    it('should be a constructor', function() {
        var instance = new Container();

        instance.should.be.instanceOf(Container);
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

        it('should allow defining a concrete using a factory function', function () {
            var container = new Container();

            container.bind('ServiceOne', function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

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

            container.bind('ServiceOne', function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            var instanceOne = container.build('ServiceOne');

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should pass parameters to factory functions', function () {
            var container = new Container();

            container.bind('ServiceOne', function (app, text) {
                app.should.be.instanceOf(Container);
                text.should.be.equal('Hello');

                return new ServiceOne();
            });

            var instanceOne = container.build('ServiceOne', ['Hello']);

            instanceOne.should.be.instanceOf(ServiceOne);
        });

        it('should not create instances of abstracts', function () {
            var container = new Container();

            container.bind('ServiceOne', function (app) {
                app.should.be.instanceOf(Container);

                return new ServiceOne();
            });

            container.bind('HelloService', 'ServiceOne');

            (function () {
                container.build('HelloService');
            }).should.throw();
        });

        it('should resolved nested dependencies', function () {
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
});
