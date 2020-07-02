'use strict';

/* eslint-disable no-magic-numbers */

/**
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @public
 * @returns {string} A GUID.
 */
export default function createGuid() {
    /**
     * S4
     * @returns {string} An 4 alpha-numeric character string block.
     */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
