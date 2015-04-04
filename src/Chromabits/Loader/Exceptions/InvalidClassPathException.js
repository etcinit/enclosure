'use strict';

/**
 * Class InvalidClassPathException
 *
 * Thrown when a class path is invalid
 */
class InvalidClassPathException extends Error
{
    /**
     * Construct an instance of an InvalidClassPathException
     */
    constructor () {
        super('Invalid class path');
    }
}

export default InvalidClassPathException;
