/**
 * HeaderViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.HeaderViewModel = function HeaderViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.HeaderViewModel}
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
