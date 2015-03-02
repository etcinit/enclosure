'use strict';

let root = '../../../src/',
    path = require('path');

let AutoloaderFactory = require(
        root + 'Chromabits/Loader/AutoloaderFactory.js'
    ),
    AbstractMapper = require(root + 'Chromabits/Mapper/AbstractMapper.js'),
    Loader = require(root + 'Chromabits/Loader/Loader.js');

describe('Chromabits/Loader/AutoloaderTest', () => {
    it('should be a constructor', () => {
        let instance = new AutoloaderFactory({});

        instance.should.be.instanceOf(AutoloaderFactory);
    });

    it('should parse config', () => {
        let instance = new AutoloaderFactory({
            path: path.resolve(root, '../example'),
            roots: [
                'src'
            ]
        });

        instance.config.enclosure.should.be.true;

        instance = new AutoloaderFactory({
            path: path.resolve(root, '../example'),
            roots: [
                'src'
            ],
            enclosure: false
        });

        instance.config.enclosure.should.be.false;
    });

    describe('#makeMappers', () => {
        it('should generate an array of mappers', () => {
            let instance = new AutoloaderFactory({
                path: path.resolve(root, '../example'),
                roots: [
                    'src'
                ]
            });

            let result = instance.makeMappers();

            result.forEach((mapper) => {
                mapper.should.be.instanceOf(AbstractMapper);
            });
        });
    });

    describe('#make', () => {
        it('should generate loaders with roots', () => {
            let instance = new AutoloaderFactory({
                path: path.resolve(__dirname, root, '../example'),
                roots: [
                    'src'
                ],
                enclosure: false
            });

            let loader = instance.make();

            loader.should.be.instanceOf(Loader);

            loader.has('Example/Support/Logger').should.be.true;
            loader.has('Chromabits/Container/Container').should.be.false;
        });

        it('should generate loaders with the enclosure map', () => {
            let instance = new AutoloaderFactory({});

            let loader = instance.make();

            loader.has('Chromabits/Container/Container').should.be.true;
        });
    });
});
