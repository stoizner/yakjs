/**
 * Stopping the default behavior
 * @param {Function} callback
 * @returns {Function}
 */
yak.ui.preventDefault = function preventDefault(callback) {
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
};
