var _ = require('underscore');

const nameParts = ['av', 'ag', 'ab', 'ap', 'ach', 'ex', 'eff', 'equ', 'ed', 'es', 'is', 'in', 'id', 'ik', 'il', 'ou', 'op', 'om', 'ot', 'og', 'un', 'up', 'ur', 'us', 'uh'];


function createRandomName() {
    var numberOfPartsToUse = _.random(2, 5);

    var name = '';

    _.times(numberOfPartsToUse, function() {
        name = name + nameParts[_.random(0, nameParts.length-1)];
    });

    return name;
}

/**
 * @returns {string}
 */
module.exports.createRandomName = createRandomName;
