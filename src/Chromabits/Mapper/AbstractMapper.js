'use strict';

var AbstractMapper;

/**
 * Mapper
 *
 * A class capable of matching multiple class names from a repository into
 * concrete implementations such as Javascript files or a constructor
 * function.
 *
 * @returns {undefined} -
 */
AbstractMapper = function () {

};

/**
 * Generate class map
 *
 * An implementation of a mapper should perform some logic to map abstract
 * class names with namespaces to a filepath or constructor function
 *
 * @returns {enclosure.Chromabits.Mapper.AbstractMapper} -
 */
AbstractMapper.prototype.generate = function () {
    throw new Error(
        'Every Enclosure mapper should implement the generate() method'
    );
};

module.exports = AbstractMapper;
