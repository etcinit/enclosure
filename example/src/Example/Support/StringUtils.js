'use strict';

/**
 * String Utilities
 *
 * An example string utilities class
 */
class StringUtils {
    /**
     * Returns a string reversed
     *
     * @param {String} input -
     *
     * @return {String} -
     */
    reverse (input) {
        var output = '';

        for (var index = input.length - 1; index > 0; index--) {
            output += input[index];
        }

        return output;
    }
}

export default StringUtils;
