'use strict';

/**
 * Class App
 *
 * An example console application using Enclosure
 */
class App
{
    constructor (HelloWorld)
    {
        this.helloworld = HelloWorld;
    }

    main (args)
    {
        console.log('This is an example application');

        this.helloworld.say();
    }
}

module.exports = App;
