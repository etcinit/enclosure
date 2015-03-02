'use strict';

let rootPath = require('app-root-path');

let Loader = require('../Loader/Loader.js'),
    MetadataParser = require('../Container/MetadataParser.js'),
    AutoloaderFactory = require('../Loader/AutoloaderFactory.js'),
    Application = require('../Container/Application.js'),
    EnclosureClassMap = require('../Mapper/EnclosureClassMap.js');

/**
 * Class Bootstrapper
 *
 * Completely automates the process of setting up an Enclosure application.
 * Configuration can be partially set through package.json. Other options can
 * be passed through the constructor.
 */
class Bootstrapper
{
    /**
     * Constructs an instance of a Bootstrapper
     *
     * @param options
     */
    constructor (options = {})
    {
        this.config = options;

        // If no metadata object or path is given, try to get package.json
        if (!options.metadata) {
            options.metadata = rootPath.resolve('./package.json');
        }

        this.metadata = new MetadataParser(options.metadata);
    }

    /**
     * Create and setup an Enclosure application
     *
     * @returns {Application}
     */
    boot ()
    {
        this.bootAutoloader();
        this.bootContainer();
        this.bootApplication();

        if (this.metadata.getEntrypoint()) {
            return this.runApplication();
        }

        return this.container;
    }

    /**
     * Setup an autoloader
     */
    bootAutoloader ()
    {
        let factory = new AutoloaderFactory(this.metadata.getAutoload());

        this.autoloader = factory.make();
    }

    /**
     * Setup the container
     */
    bootContainer ()
    {
        this.container = new Application();

        this.container.setLoader(this.autoloader);

        // Install application
        if (this.config.installTo) {
            this.container.installTo(this.config.installTo);
        } else {
            this.container.installTo(global);
        }
    }

    /**
     * Setup the application
     */
    bootApplication ()
    {
        // Parse providers
        let providers = this.metadata.getProviders();

        // Add providers
        providers.forEach((provider) => {
            this.container.addProvider(provider)
        });

        // Register providers
        this.container.register();

        // Boot providers
        this.container.bootProviders();
    }

    /**
     * Start and run the application
     *
     * @returns {Loader|*}
     */
    runApplication ()
    {
        let entrypoint = this.container.make(this.metadata.getEntrypoint());

        return entrypoint.main(process.argv);
    }

    /**
     * Setup the prelude environment
     *
     * @param target
     *
     * @returns {Bootstrapper}
     */
    static setupPrelude(target = global)
    {
        var loader = new Loader();

        loader.addMap(EnclosureClassMap);
        target.use = loader.get.bind(loader);

        return this;
    }
}

module.exports = Bootstrapper;
