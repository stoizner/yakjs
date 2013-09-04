/**
 * S4
 * @returns {string}
 */
function s4() {

    'use strict';

    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

/**
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @returns {string}
 */
function guid() {

    'use strict';

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
