'use strict';

/**
 * Class NotImplementedException
 *
 * Thrown when a component or method is currently not implemented by the
 * application
 */
class NotImplementedException extends Error
{
    /**
     * Construct an instance of a NotImplementedException
     *
     * @param componentName
     */
    constructor (componentName) {
        if (componentName) {
            super(`${componentName} is not implemented by this object`);
            return;
        }

        super('This component/method is not implemented by this object');
    }
}

export default NotImplementedException;
