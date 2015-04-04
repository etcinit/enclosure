'use strict';

/**
 * Class App
 *
 * An example console application using Enclosure
 */
class App {
    /**
     * Contruct an instance of an App
     *
     * @param HelloWorld - HelloWorld Service
     */
    constructor (HelloWorld) {
        this.helloworld = HelloWorld;
    }

    /**
     * Main method of the application
     */
    main (args) {
        console.log('This is an example application');

        this.helloworld.say();
    }
}

module.exports = App;
