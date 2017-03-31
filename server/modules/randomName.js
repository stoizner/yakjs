'use strict';

let _ = require('underscore');

const MIN_LEN = 2;
const MAX_LEN = 5;

const nameParts = [
    'av', 'ag', 'ab', 'ap', 'ach', 'ex', 'eff', 'equ',
    'ed', 'es', 'is', 'in', 'id', 'ik', 'il', 'ou',
    'op', 'om', 'ot', 'og', 'un', 'up', 'ur', 'us', 'uh'];

function createRandomName() {
    let numberOfPartsToUse = _.random(MIN_LEN, MAX_LEN);
    let name = '';

    _.times(numberOfPartsToUse, function() {
        name += nameParts[_.random(0, nameParts.length - 1)];
    });

    return name;
}

/**
 * @returns {string}
 */
module.exports.createRandomName = createRandomName;
