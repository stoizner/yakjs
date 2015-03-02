/**
 * Name compare
 * @param {{name:string}} a The first object
 * @param{{name:string}} b The second object
 */
yak.ui.nameCompare = function nameCompare(a, b) {
    'use strict';

    /**
     * @type {number}
     */
    var result = 0;

    if (a.name < b.name) {
        result = -1;
    } else if (a.name > b.name) {
        result = 1;
    }

    return result;
};