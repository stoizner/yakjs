var ModuleListItem = require('./moduleListItem');
var ModuleDetailView = require('../details/moduleDetailView');
var ShowViewCommand = require('../../workspace/showViewCommand');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function ModuleListViewModel(context) {
    'use strict';

    /**
     * @type {!ModuleListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!ModuleListItem>}
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
        console.log('ModuleListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('ModuleListViewModel.active');
        context.adapter.get('/modules/names').then(handleGetModulesResponse);
    };

    /**
     * @param {string} name
     */
    this.deleteModule = function deleteModule(name) {
        context.adapter.deleteResource('/modules/' + name).then(self.reloadAndRefreshList);
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

        context.eventBus.post(new ShowViewCommand(ModuleDetailView, item.moduleName));
    };

    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.get('/modules/names').then(handleGetModulesResponse);
    };

    this.clearModuleCache = function clearModuleCache() {
        context.adapter.post('/modules/cache/clear');
    };

    /**
     * @param {{moduleNames: Array<string>}} response
     */
    function handleGetModulesResponse(response) {
        console.log('handleGetModulesResponse', response);

        self.items = response.moduleNames.map(function toItem(moduleName) {
            return new ModuleListItem(moduleName);
        });
        self.onItemsChanged();
    }

    constructor();
}

module.exports = ModuleListViewModel;

