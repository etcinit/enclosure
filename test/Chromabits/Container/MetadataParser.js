'use strict';

let root = '../../../src/',
    path = require('path');

let MetadataParser = require(root + 'Chromabits/Container/MetadataParser.js');

describe('Chromabits/Container/MetadataParser', () => {
    it('should be a constructor and accept JSON files', () => {
        new MetadataParser(path.resolve(
            __dirname + '../../../../example/package.json'
        ));
    });

    it('should be a constructor and accept regular objects', () => {
        new MetadataParser({
            entrypoint: 'Example/Console/App',
            providers: [
                'Example/Providers/ExampleProvider'
            ],
            autoload: {
                path: path.resolve(__dirname + '../../../../example/'),
                roots: [
                    'src'
                ]
            }
        })
    });

    it('should not allow autoload objects without a path', () => {
        (() => {
            new MetadataParser({
                entrypoint: 'Example/Console/App',
                providers: [
                    'Example/Providers/ExampleProvider'
                ],
                autoload: {
                    roots: [
                        'src'
                    ]
                }
            });
        }).should.throw();

        (() => {
            new MetadataParser({
                entrypoint: 'Example/Console/App',
                providers: [
                    'Example/Providers/ExampleProvider'
                ]
            });
        }).should.not.throw();
    });

    describe('#getEntrypoint', () => {
        it('should get the entrypoint', () => {
            let parserOne = new MetadataParser({
                entrypoint: 'Example/Console/App'
            });
            let parserTwo = new MetadataParser({});
            let parserThree = new MetadataParser(path.resolve(
                __dirname + '../../../../example/package.json'
            ));

            parserOne.getEntrypoint().should.be.equal('Example/Console/App');
            (parserTwo.getEntrypoint() === null).should.be.true;
            parserThree.getEntrypoint().should.be.equal('Example/Console/App');
        })
    });

    describe('#getProviders', () => {
        it('should get providers array', () => {
            let parser = new MetadataParser(path.resolve(
                __dirname + '../../../../example/package.json'
            ));

            parser.getProviders().should.be.eql([
                'Example/Providers/ExampleProvider'
            ]);
        });

        it('should have a default value', () => {
            let parser = new MetadataParser();

            parser.getProviders().should.be.eql([]);
        });
    });

    describe('#getAutoload', () => {
        it('should get autoload object', () => {
            let parser = new MetadataParser(path.resolve(
                __dirname + '../../../../example/package.json'
            ));

            parser.getAutoload().should.be.Object;
        });

        it('should have a default value', () => {
            let parser = new MetadataParser();

            parser.getAutoload().should.be.eql({});
        });
    });
});
