/**
 * Compares the label property of two objects.
 * @param {{label:string}} left The first object
 * @param {{label:string}} right The second object
 */
function compareLabel(left, right) {
    'use strict';

    return left.label.localeCompare(right.label);
}

module.exports = compareLabel;
