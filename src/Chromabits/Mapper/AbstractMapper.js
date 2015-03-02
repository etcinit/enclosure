'use strict';

let NotImplementedException = require(
    '../Exceptions/NotImplementedException.js'
);

/**
 * Class AbstractMapper
 *
 * A class capable of matching multiple class names from a repository into
 * concrete implementations such as Javascript files or a constructor
 * function.
 */
class AbstractMapper
{
    /**
     * Generate class map
     *
     * An implementation of a mapper should perform some logic to map abstract
     * class names with namespaces to a file path or constructor function
     *
     * @returns {AbstractMapper} -
     */
    generate ()
    {
        throw new NotImplementedException('generate()');
    }
}

module.exports = AbstractMapper;
