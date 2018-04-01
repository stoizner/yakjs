/**
 * Compares the name property of two objects.
 * @param {{name:string}} left The first object
 * @param {{name:string}} right The second object
 */
function compareName(left, right) {
    'use strict';

    return left.name.localeCompare(right.name);
}

module.exports = compareName;
