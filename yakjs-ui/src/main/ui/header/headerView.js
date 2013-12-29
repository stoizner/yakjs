/**
 * HeaderView
 * @class
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.HeaderViewModel} viewModel
 */
yak.ui.HeaderView = function HeaderView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.HeaderView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('header');

    /**
     * Connection State CSS class
     */
    this.classConnectionState = context.ko.observable();

    /**
     * WebSocket uri input
     */
    this.webSocketUri = context.ko.observable();

    /**
     * Constructor
     */
    function constructor() {
        parent.html(template.build());

        $('#webSocketConnect').click(handleConnectClick);

        viewModel.onWebSocketConnectedChanged = updateConnectionState;

        self.webSocketUri(viewModel.webSocketUri);

        context.ko.applyBindings(self, parent[0]);
    }

    /**
     * Update Connection State
     */
    function updateConnectionState() {
        console.log('updateConnectionState ' + viewModel.isWebSocketConnected);
        if (viewModel.isWebSocketConnected) {
            self.classConnectionState('state-connected');
        } else {
            self.classConnectionState('state-error');
        }
    }

    /**
     * Handle connect button click.
     */
    function handleConnectClick() {
        viewModel.connect(self.webSocketUri());
    }

    constructor();
};