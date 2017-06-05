var createGuid = require('../../../../server/common/guid');
/**
 * @constructor
 */
function CommandListItem() {
    'use strict';

    /**
     * Whether the command is a pure command or a preset.
     * @type {boolean}
     */
    this.isPreset = false;

    /**
     * @type {string}
     */
    this.commandId = createGuid();

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
    this.originalCommandPresetName = null;

    /**
     * @type {?string}
     */
    this.commandPresetName = null;

    /**
     * @type {string}
     */
    this.displayName = '';

    /**
     * @type {string}
     */
    this.description = '';

    /**
     * @type {string}
     */
    this.exampleData = '';

    /**
     * @type {string}
     */
    this.commandData = '';

    /**
     * @type {string}
     */
    this.pluginId = '';
}

module.exports = CommandListItem;
