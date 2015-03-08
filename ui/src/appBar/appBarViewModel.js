/**
 * AppBarViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.AppBarViewModel = function AppBarViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.AppBarViewModel}
     */
    var self = this;

    /**
     * Callback when a notification is active.
     * @type {yak.ui.noop}
     */
    this.onNotificationActiveChanged = _.noop;

    /**
     * Constructor
     */
    function constructor() {
        context.eventBus.on(yak.ui.UpdateNotificationCommand).register(handleUpdateNotificationCommand);
    }

    /**
     * @param {yak.ui.UpdateNotificationCommand} command
     */
    function handleUpdateNotificationCommand(command) {
        if (command.text) {
            self.onNotificationActiveChanged(true);
        } else {
            self.onNotificationActiveChanged(false);
        }
    }

    constructor();
};
