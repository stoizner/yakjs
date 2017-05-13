/**
 * @param string
 * @returns {string}
 */
function base64ToUtf8(string) {
    'use strict';
    return decodeURIComponent(encodeURI(window.atob(string)));
}

module.exports = base64ToUtf8;

