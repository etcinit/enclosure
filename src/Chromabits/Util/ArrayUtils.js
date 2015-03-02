'use strict';

/**
 * Class ArrayUtils
 *
 * Some array utilities
 */
class ArrayUtils
{
    /**
     * A helper function for looping through arrays until the callback returns
     * a value (anything that is not undefined)
     *
     * @param target
     * @param callback
     * @param def
     * @returns {*}
     */
    static forEachUntil (target, callback, def)
    {
        // Go through the array
        for (var index in target) {
            if (target.hasOwnProperty(index)) {
                let item = target[index];

                let result = callback(item, index, target);

                // If the callback returns anything, return it
                if (result !== undefined) {
                    return result;
                }
            }
        }

        // If there is a default value, return that instead of nothing
        if (def !== undefined) {
            return def;
        }
    }
}

module.exports = ArrayUtils;
