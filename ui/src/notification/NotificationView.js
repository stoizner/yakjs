/**
 * NotificationView
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.NotificationViewModel} viewModel
 */
yak.ui.NotificationView = function NotificationView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.NotificationView}
     */
    var self = this;

    this.isNotificationVisible = ko.observable(false);

    /**
     * Constructor
     */
    function constructor() {
        ko.applyBindings(self, parent[0]);

        viewModel.onNotificationTextChanged = updateNotification;
    }

    /**
     * Display the notification or hide it when null.
     */
    function updateNotification() {
        console.log('updateNotification ' + viewModel.notificationText);
        if (viewModel.notificationText) {
            self.isNotificationVisible(true);
            parent.html(viewModel.notificationText);
        } else {
            self.isNotificationVisible(false);
            parent.html('');
        }
    }

    constructor();
};