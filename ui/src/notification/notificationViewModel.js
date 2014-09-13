/**
 * NotificationViewModel
 * @class
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.NotificationViewModel = function NotificationViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.NotificationViewModel}
     */
    var self = this;

    /**
     * Notification info
     * @type {{text:string}
     */
    this.notificationText = null;

    /**
     * Callback function for a new notification
     * @type {Function}
     */
    this.onNotificationTextChanged = yak.ui.noop();

    /**
     * Constructor
     */
    function constructor() {
        console.log('ctor yak.ui.NotificationViewModel');
        context.eventBus.on(yak.ui.UpdateNotificationCommand).register(function(command) {
            console.log('on yak.ui.UpdateNotificationCommand', command);
            if (command.text !== self.notificationText) {
                self.notificationText = command.text;
                self.onNotificationTextChanged();
            }
        });
    }

    constructor();
};