'use strict';

/**
 * Class HelloWorld
 *
 * A simple hello world service
 */
class HelloWorld
{
    /**
     * Construct an instance of a HelloWorld
     *
     * @param Example_Support_Logger
     */
    constructor (Example_Support_Logger) {
        // Keep references to dependencies
        this.logger = Example_Support_Logger;
    }

    /**
     * Say hello world!
     */
    say () {
        this.logger.log('Hello World');
    }
}

export default HelloWorld;
