/**
 * Id compare
 * @param {{id:string}} a The first object
 * @param{{id:string}} b The second object
 */
function idCompare(a, b) {
    'use strict';

    /**
     * @type {number}
     */
    var result = 0;

    if (a.id < b.id) {
        result = -1;
    } else if (a.id > b.id) {
        result = 1;
    }

    return result;
}

module.exports = idCompare;
