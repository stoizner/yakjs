/**
 *
 * @returns {string}
 * @param string
 */
function utf8ToBase64(string) {
    'use strict';
    return window.btoa(decodeURI(encodeURIComponent(string)));
}

module.exports = utf8ToBase64;

