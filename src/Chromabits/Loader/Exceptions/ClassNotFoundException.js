'use strict';

var ClassNotFoundException;

/**
 * ClassNotFoundException
 *
 * Thrown when a class is not found
 *
 * @param {string} className -
 *
 * @returns {undefined} -
 */
ClassNotFoundException = function (className) {
    Error.call(this, arguments);

    this.setClassName(className);
};

/**
 * Set the name of the class that was not found
 *
 * @param {string} className -
 *
 * @returns {undefined} -
 */
ClassNotFoundException.prototype.setClassName = function (className) {
    this.message = 'Class `' + className + '` is not defined in the current'
        + ' context. Check your class map setup';
};

module.exports = ClassNotFoundException;
