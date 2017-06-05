/**
 * http://www.yakjs.com/api/commands.html#CommandPreset
 * @constructor
 */
function CommandPreset() {
    'use strict';

    /**
     * @type {?string}
     */
    this.name = null;

    /**
     * @type {?string}
     */
    this.displayName = '';

    /**
     * @type {?string}
     */
    this.groupName = '';

    /**
     * @type {?string}
     */
    this.commandName = '';

    /**
     * @type {?string}
     */
    this.commandData = '';
}

module.exports = CommandPreset;
