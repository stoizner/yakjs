/**
 * Succes property compare
 * @param {{success:boolean}} a The first object
 * @param{{success:boolean}} b The second object
 */
yak.ui.successCompare = function successCompare(a, b) {
    'use strict';

    /**
     * @type {number}
     */
    var result = 0;

    if (a.success === false && b.success === true) {
        result = -1;
    } else if (a.success === true && b.success === false) {
        result = 1;
    }

    return result;
};
