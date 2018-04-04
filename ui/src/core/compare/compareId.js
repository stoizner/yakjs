/**
 * Compares the id property of two objects.
 * @param {{name:string}} left The first object
 * @param {{name:string}} right The second object
 */
function compareName(left, right) {
    'use strict';

    return left.id.localeCompare(right.id);
}

module.exports = compareName;
