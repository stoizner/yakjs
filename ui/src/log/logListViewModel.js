/**
 * LogListViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.LogListViewModel = function LogListViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.LogListViewModel}
     */
    var self = this;

    /**
     * @type {Array.<yak.ui.LogListItem>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = yak.ui.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.LogListViewModel.constructor');
        context.eventBus.on(yak.api.GetLogInfoResponse).register(handleGetLogInfoResponse);
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.LogListViewModel.active');
        context.webSocket.sendRequest(new yak.api.GetLogInfoRequest(), _.noop);
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        // SMELL: Make the refresh not so brutal.
        context.webSocket.sendRequest(new yak.api.GetLogInfoRequest(), _.noop);
    };

    /**
     * @param {yak.api.GetLogInfoResponse} response
     */
    function handleGetLogInfoResponse(response) {
        console.log('handleGetLogInfoResponse');

        self.items = response.logs;
        self.onItemsChanged();
    }

    constructor();
};