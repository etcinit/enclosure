'use strict';

var StringUtils;

/**
 * String Utilities
 *
 * An example string utilities class
 *
 * @return {undefined} -
 */
StringUtils = function () {

};

/**
 * Returns a string reversed
 *
 * @param {String} input -
 *
 * @return {String} -
 */
StringUtils.prototype.reverse = function (input) {
    var output = '';

    for (var index = input.length - 1; index > 0; index--) {
        output += input[index];
    }

    return output;
};

module.exports = StringUtils;
