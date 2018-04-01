/**
 * @constructor
 * @param {string} presetName
 * @param {string} displayName
 * @param {string} commandName
 * @param {string} groupName
 * @extends {ListItem}
 */
function CommandListItem(presetName, displayName, commandName, groupName) {
    'use strict';

    /**
     * This is the unique preset name.
     * @type {string}
     * @inheritDoc
     */
    this.id = presetName;

    /**
     * @type {string}
     * @inheritDoc
     */
    this.label = displayName || presetName;

    /**
     * @type {string}
     */
    this.commandName = commandName;

    /**
     * @type {string}
     */
    this.groupName = groupName;
}

module.exports = CommandListItem;
