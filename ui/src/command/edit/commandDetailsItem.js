/**
 * @constructor
 * @param {string} presetName
 */
function CommandDetailsItem(presetName) {
    'use strict';

    /**
     * @type {string}
     * @inheritDoc
     */
    this.presetName = presetName;

    /**
     * @type {?string}
     * @inheritDoc
     */
    this.displayName = null;

    /**
     * @type {?string}
     */
    this.commandName = null;

    /**
     * @type {?string}
     */
    this.groupName = null;

    /**
     * @type {?string}
     */
    this.commandData = null;

    /**
     * @type {?string}
     */
    this.pluginId = null;
}

module.exports = CommandDetailsItem;
