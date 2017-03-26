/**
 * ModuleListViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.ModuleListViewModel = function ModuleListViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.ModuleListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!yak.ui.ModuleListItem>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.ModuleListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.ModuleListViewModel.active');
        context.adapter.get('/modules/names').then(handleGetModulesResponse);
    };

    /**
     * Delete module.
     * @param {string} name
     */
    this.deleteModule = function deleteModule(name) {
        var request = new yak.api.DeleteModuleRequest();
        request.moduleName = name;
        context.adapter.sendRequest(request, handleDeleteModuleResponse);
    };

    /**
     * Show and activate the module edit panel.
     * @param {string} [moduleName]
     */
    this.activateModuleDetailPanel = function activateModuleEditPanel(moduleName) {
        var item = null;

        if (moduleName) {
            item = _.findWhere(self.items, {moduleName: moduleName});
        }

        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.ModuleDetailView, item.moduleName));
    };

    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.get('/modules/names').then(handleGetModulesResponse);
    };

    this.clearModuleCache = function clearModuleCache() {
        context.adapter.post('/modules/cache/clear');
    };

    /**
     * @param {!yak.api.GetModuleNamesResponse} response
     */
    function handleGetModulesResponse(response) {
        console.log('handleGetModulesResponse', response);

        self.items = _.map(response.moduleNames, function toItem(moduleName) {
            return new yak.ui.ModuleListItem(moduleName);
        });
        self.onItemsChanged();
    }

    /**
     * @param {!yak.DeleteModuleResponse} response
     */
    function handleDeleteModuleResponse(response) {
        console.log('handleDeleteModuleResponse', response);
        self.reloadAndRefreshList();
    }

    constructor();
};
