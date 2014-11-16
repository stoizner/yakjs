/**
 * UpdateNotificationCommand
 * @constructor
 * @param {string} text The text for the notification.
 */
yak.ui.UpdateNotificationCommand = function UpdateNotificationCommand(text) {
    'use strict';

    /**
     * Event type
     * @type {string}
     */
    this.type = 'yak.ui.UpdateNotificationCommand';

    /**
     * The notification text.
     * @type {?string}
     */
    this.text = text || null;
};
