"use strict";

var Container = require('../src/Chromabits/Container/Container'),

    Wrap = require('../src/Chromabits/Container/Wrap');

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
});
