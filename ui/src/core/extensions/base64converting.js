/**
 *
 * @returns {string}
 * @param string
 */
yak.ui.utf8ToBase64 = function utf8ToBase64(string) {
    'use strict';
    return window.btoa(decodeURI(encodeURIComponent(string)));
};

/**
 *
 * @param string
 * @returns {string}
 */
yak.ui.base64ToUtf8 = function base64ToUtf8(string) {
    'use strict';
    return decodeURIComponent(encodeURI(window.atob(string)));
};
