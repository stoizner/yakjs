'use strict';

/**
 * @constructor
 * @struct
 */
export function CommandPreset() {
    /**
     * @type {string}
     */
    this.name = null;

    /**
     * @type {string}
     */
    this.displayName = null;

    /**
     * @type {string}
     */
    this.groupName = null;

    /**
     * @type {string}
     */
    this.commandName = null;

    /**
     * The data example needs to be JSON serializable.
     * @type {?}
     */
    this.commandData = null;
}
