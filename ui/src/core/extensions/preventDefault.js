/**
 * Stopping the default behavior
 * @param {Function} callback
 * @returns {Function}
 */
function preventDefault(callback) {
    'use strict';

    return function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if (event.returnValue) {
            // internet explorer
            event.returnValue = false;
        }

        callback();

        return false;
    }
}

module.exports = preventDefault;
