'use strict';

let root = '../../../src/',
    path = require('path');

let Bootstrapper = require(root + 'Chromabits/Bootstrapper/Bootstrapper.js'),
    Container = require(root + 'Chromabits/Container/Container.js'),
    Application = require(root + 'Chromabits/Container/Application.js'),
    Loader = require(root + 'Chromabits/Loader/Loader.js');

describe('Chromabits/Bootstrapper/BootrapperTest', () => {
    it('should be a constructor', () => {
        let instance = new Bootstrapper();

        instance.should.be.instanceOf(Bootstrapper);
    });

    it('should support a metadata option', () => {
        let instance = new Bootstrapper({
            metadata: path.resolve(__dirname, root, '../example/package.json')
        });

        instance.should.be.instanceOf(Bootstrapper);
    });

    describe('#bootAutoloader', () => {
        it('should setup an autoloader', () => {
            let instance = new Bootstrapper({
                metadata: path.resolve(
                    __dirname,
                    root,
                    '../example/package.json'
                )
            });

            instance.bootAutoloader();

            instance.autoloader.should.be.instanceOf(Loader);
            instance.autoloader.has('Example/Support/Logger').should.be.true;
        });
    });

    describe('#bootContainer', () => {
        it('should setup a container', () => {
            let target = {};
            let instance = new Bootstrapper({
                metadata: path.resolve(
                    __dirname,
                    root,
                    '../example/package.json'
                ),
                installTo: target
            });

            instance.bootAutoloader();
            instance.bootContainer();

            instance.container.should.be.instanceOf(Container);
            instance.container.make('Example/Support/Logger').should.be.Object;

            target.should.have.property('container');
            target.should.have.property('use');
        });
    });

    describe('#bootApplication', () => {
        it('should setup an application', () => {
            let instance = new Bootstrapper({
                metadata: path.resolve(
                    __dirname,
                    root,
                    '../example/package.json'
                )
            });

            instance.bootAutoloader();
            instance.bootContainer();
            instance.bootApplication();

            container.make('HelloWorld').should.be.Object;

            // Clean up
            global.container = undefined;
            global.use = undefined;
        });
    });

    describe('#runApplication', () => {
        it('should run the entrypoint', () => {
            let container = new Container();

            container.instance('Entrypoint', {
                main (argv)
                {
                    argv.should.be.Array;

                    return 'wow';
                }
            });

            let bootstrapper = new Bootstrapper({
                metadata: {
                    entrypoint: 'Entrypoint'
                }
            });

            bootstrapper.container = container;

            bootstrapper.runApplication().should.be.equal('wow');
        });
    });

    describe('#boot', () => {
        it('should setup the application and run the entrypoint', () => {
            let instance = new Bootstrapper({
                metadata: {
                    entrypoint: 'Example/Support/TestEntrypoint',
                    providers: [
                        'Example/Providers/ExampleProvider'
                    ],
                    autoload: {
                        path: path.resolve(__dirname, root, '../example'),
                        roots: ['src']
                    }
                }
            });

            instance.boot().should.be.equal('Correct');

            // Clean up
            global.container = undefined;
            global.use = undefined;
        });
    });
});
